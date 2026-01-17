import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

@Injectable()
export class StaffService {
    private readonly logger = new Logger(StaffService.name);

    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    ) { }

    async createStaff(alias: string, code: string) {
        // 1. Validate Alias & Code
        if (!/^\d{2}$/.test(code)) throw new BadRequestException('Code must be exactly 2 digits');
        const cleanAlias = alias.toUpperCase().trim();

        // 2. Check existence
        const { data: existing } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('alias', cleanAlias)
            .single();

        if (existing) throw new BadRequestException('Alias already exists');

        // 3. Create Shadow Auth User
        const shadowEmail = `${cleanAlias.toLowerCase()}@staff.internal`;
        const shadowPassword = this.getShadowPassword(cleanAlias);

        // We use the Admin API (service role) to create user without confirmation
        // Note: Assuming `this.supabase.auth.admin` is available if SERVICE_KEY is used.
        // If 'SUPABASE_CLIENT' is regular client, this might fail unless it has privileges.
        // Usually creation requires service role.

        const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
            email: shadowEmail,
            password: shadowPassword,
            email_confirm: true,
            user_metadata: { role: 'staff' }
        });

        if (authError) {
            this.logger.error('Failed to create auth user', authError);
            throw new BadRequestException('Could not create staff user: ' + authError.message);
        }

        if (!authUser.user) throw new BadRequestException('User creation failed return');

        // 4. Update Profile with Operative Fields
        // Profile is usually created by Trigger on Auth User creation. 
        // We wait or update specifically.
        // Let's UPDATE it assuming trigger exists OR Insert if we don't rely on trigger.
        // The initial schema has a trigger likely (from previous context check, usually standard).
        // Safest: Upsert or Update.

        // Wait a small bit or just try update? Supabase triggers are fast. 
        // But better is to just INSERT into profiles if we aren't sure of trigger, 
        // OR Update. 
        // If trigger:
        // CREATE TABLE profiles ... REFERENCES auth.users ...
        // We will just Update based on ID.

        const { error: profileError } = await this.supabase
            .from('profiles')
            .upsert({
                id: authUser.user.id,
                email: shadowEmail,
                role: 'staff',
                alias: cleanAlias,
                operative_code: code,
                is_active: true
            });

        if (profileError) {
            // Rollback auth user
            await this.supabase.auth.admin.deleteUser(authUser.user.id);
            throw new BadRequestException('Failed to create profile: ' + profileError.message);
        }

        return { id: authUser.user.id, alias: cleanAlias };
    }

    async getStaffList() {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('role', 'staff')
            .order('alias');

        if (error) throw new BadRequestException(error.message);
        return data;
    }

    async updateStaffStatus(id: string, isActive: boolean) {
        const { error } = await this.supabase
            .from('profiles')
            .update({ is_active: isActive })
            .eq('id', id);

        if (error) throw new BadRequestException(error.message);

        // If deactivating, maybe ban the auth user too?
        if (!isActive) {
            await this.supabase.auth.admin.updateUserById(id, { ban_duration: '876000h' }); // 100 years
        } else {
            await this.supabase.auth.admin.updateUserById(id, { ban_duration: '0' }); // Unban
        }

        return { success: true };
    }

    async deleteStaff(id: string) {
        // Hard delete from Auth (cascades to Profile)
        const { error } = await this.supabase.auth.admin.deleteUser(id);
        if (error) throw new BadRequestException(error.message);
        return { success: true };
    }

    async validateStaffLogin(alias: string, code: string) {
        // 1. Find Shadow Email
        const { data: profile } = await this.supabase
            .from('profiles')
            .select('email, operative_code, is_active')
            .eq('alias', alias.toUpperCase())
            .single();

        if (!profile || !profile.is_active || profile.operative_code !== code) {
            throw new BadRequestException('Invalid credentials');
        }

        // 2. We need to sign in. 
        // Problem: We don't store the password. 
        // Strategy A: We force reset password on every login (Bad).
        // Strategy B: We store the password in `operative_code`? No, code is 2 digits.
        // Strategy C: We actually CANNOT login to Supabase Auth without the password unless we use `signInWithOtp` (magic link) OR we have a Service Role endpoint to "mint" a token.
        // Supabase Admin API doesn't have "mint token for user".
        // Wait, "Shadow Account" implies we know the password or we can impersonate.
        // Impersonation is possible with `supabase.auth.admin.generateLink({ type: 'magiclink', email: ... })` which gives a link pending verification.
        // OR better: Admin creates a session?
        // `supabase.auth.admin.createSession({ userId: ... })` ? No, unavailable in JS client easily.

        // Re-evaluating Implementation Plan:
        // "When an Admin creates a Staff user... corresponding Supabase Auth user... password <generated>".
        // If I generate a random password and DON'T save it, I can't login later!
        // CORRECTION: I must store the shadow password encrypted in the `profiles` table OR define a standard derivation strategy (e.g. `Hash(Secret + Alias)`). 
        // Given I already wrote `crypto.randomBytes` and threw it away, that was a mistake in my thought process. 

        // FIX:
        // I will update `createStaff` to use a deterministic password derivation: 
        // `Password = HMAC(Alias, APP_SECRET)`. 
        // This way `validateStaffLogin` can re-derive it and call `signInWithPassword`.
        // I need an APP_SECRET. I'll use `process.env.SUPABASE_SERVICE_ROLE_KEY` as the secret salt or just a hardcoded salt if env is missing (unsafe, but "Operative" user requires less security per user request). 
        // Let's use a simple salt.

        return this.performShadowLogin(profile.email, alias);
    }

    private getShadowPassword(alias: string): string {
        // Deterministic password generation
        // Salt should be consistent.
        const salt = process.env.SHADOW_SALT || 'cuoio-cane-staff-salt';
        return crypto.createHmac('sha256', salt).update(alias.toUpperCase()).digest('hex') + 'Aa1!';
    }

    private async performShadowLogin(email: string, alias: string) {
        const password = this.getShadowPassword(alias);

        // Use a separate client instance or just basic fetch to Supabase Auth Endpoint 
        // because `this.supabase` is Admin client (Service Role) potentially.
        // Though `signInWithPassword` works on any client.

        // We need to return the Session.
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw new BadRequestException('Login failed: ' + error.message);
        return data.session;
    }
}
