import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-cormorant',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Cuoio Cane | Admin',
    description: 'Management & Control',
};

import { createClient } from '@/lib/supabase/server';
import { Providers } from '@/components/Providers';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check for user session
    const { data: { user } } = await supabase.auth.getUser();

    let userRole: string | null = null;

    if (user) {
        // Fetch role from profiles
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            userRole = profile?.role || null;
        } catch (e) {
            console.warn('Offline: Could not fetch user role in Layout');
            // userRole remains null, Client needs to handle this fallback
        }
    }

    return (
        <html lang="es" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
            <body className="antialiased min-h-screen bg-background text-zinc-200">
                <Providers userRole={userRole}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
