'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDiscount(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // Permission check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autorizado' };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Solo administradores pueden crear descuentos' };

    // Extract data
    const code = formData.get('code') as string;
    const type = formData.get('type') as string;
    const value = parseFloat(formData.get('value') as string);
    const applies_to = formData.get('applies_to') as string;
    const min_purchase = parseFloat(formData.get('min_purchase') as string || '0');
    const usage_limit_raw = formData.get('usage_limit') as string;
    const usage_limit = usage_limit_raw ? parseInt(usage_limit_raw) : null;
    const expires_at_raw = formData.get('expires_at') as string;
    const expires_at = expires_at_raw ? new Date(expires_at_raw).toISOString() : null;

    // Validation
    if (!code || !type || isNaN(value)) {
        return { error: 'Datos inválidos. Verifique los campos obligatorios.' };
    }
    if (value < 0) {
        return { error: 'El valor no puede ser negativo.' };
    }
    if (type === 'percentage' && value > 100) {
        return { error: 'El porcentaje no puede ser mayor a 100.' };
    }

    const { error } = await supabase.from('discounts').insert({
        code: code.toUpperCase(),
        type,
        value,
        applies_to,
        min_purchase_amount: min_purchase,
        usage_limit,
        expires_at,
        active: true
    });

    if (error) {
        console.error('Error creating discount:', error);
        if (error.code === '23505') { // Unique violation
            return { error: 'El código de cupón ya existe.' };
        }
        return { error: 'Error al crear el descuento.' };
    }

    revalidatePath('/descuentos');
    redirect('/descuentos');
}

export async function toggleDiscountStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();

    // Permission check (Server Action level)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autorizado' };
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'No autorizado' };

    await supabase.from('discounts').update({ active: !currentStatus }).eq('id', id);
    revalidatePath('/descuentos');
}

export async function deleteDiscount(id: string) {
    const supabase = await createClient();

    // Permission check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autorizado' };
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'No autorizado' };

    await supabase.from('discounts').delete().eq('id', id);
    revalidatePath('/descuentos');
}
