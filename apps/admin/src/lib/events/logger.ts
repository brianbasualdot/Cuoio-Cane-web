'use server';

import { createClient } from '@/lib/supabase/server';

interface LogEventParams {
    orderId: string;
    action: string;
    alias?: string | null;
}

export async function logOrderEvent({ orderId, action, alias }: LogEventParams) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Get user role for the record
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role || 'unknown';

    const { error } = await supabase.from('order_events').insert({
        order_id: orderId,
        action,
        actor_user_id: user.id,
        actor_role: role,
        actor_alias: role === 'staff' ? alias : null, // Only store alias if staff, or always store if provided? Requirement says staff alias mandatory.
    });

    if (error) {
        console.error('Error logging event:', error);
        // We might not want to throw to avoid blocking the main action if logging fails, 
        // but for "Operational Log" integrity, maybe we should. 
        // For now, we'll return the error and let the caller decide.
        return { success: false, error: error.message };
    }

    return { success: true };
}
