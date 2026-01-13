import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.id) {
            throw new UnauthorizedException('User not authenticated');
        }

        // Check public.profiles for the role
        const { data: profile, error } = await this.supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (error || !profile) {
            throw new UnauthorizedException('User profile not found');
        }

        // Role check
        if (!profile.role || !requiredRoles.includes(profile.role)) {
            return false;
        }

        return true;
    }
}
