'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/');
}

export async function loginStaff(prevState: any, formData: FormData) {
    const alias = formData.get('alias') as string;
    const code = formData.get('code') as string;

    // Call API to validate credentials
    // Since this is server action, we can call our API directly or use Supabase Client if possible.
    // Our API `POST /staff/login` performs the shadow login logic and returns a session?
    // Wait, the API `validateStaffLogin` returns `session`. 
    // Ideally we want to set the cookie here in Next.js middleware/server client.
    // But `supabase.auth.signInWithPassword` in the API sets cookies? 
    // API is NestJS, usually sets cookies on ITS response, but Next.js Server Action is a different server/context unless they share domain/cookies.
    // Users are on `localhost:3000` (Admin) and API `localhost:3002`.
    // If API returns a Session Object (access_token, refresh_token), we can set it in Next.js using `supabase.auth.setSession`.

    // Let's call the API.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

    try {
        const res = await fetch(`${apiUrl}/staff/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alias, code })
        });

        if (!res.ok) {
            const err = await res.json();
            return { error: err.message || 'Credenciales inválidas' };
        }

        const session = await res.json(); // Expecting Session object from Supabase

        // now set session in Next.js
        const supabase = await createClient();
        const { error } = await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        });

        if (error) return { error: 'Error estableciendo sesión' };

    } catch (e) {
        console.error(e);
        return { error: 'Error de conexión' };
    }

    redirect('/');
}
