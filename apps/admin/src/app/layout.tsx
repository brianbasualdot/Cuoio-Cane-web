import './globals.css';
import { Inter, Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/sidebar';

// FONT CONFIGURATION
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-cormorant',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

// METADATA
export const metadata = {
    title: 'Cuoio Cane Admin',
    description: 'Atelier Management System',
};

// ROOT LAYOUT (The Hardened Shell)
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <html lang="es" className={`${inter.variable} ${cormorant.variable} ${playfair.variable}`}>
            <body className="h-screen w-screen overflow-hidden bg-[var(--background)] font-sans antialiased selection:bg-[var(--accent-coffee)] selection:text-white">

                {/* 
                   LAYOUT STRATEGY:
                   - If User: Flex Container [Sidebar (Fixed) | Main (Auto)]
                   - If No User: Full Screen Container [Centered Login]
                */}

                {user ? (
                    <div className="flex h-full w-full">
                        {/* Sidebar: Fixed Width, Non-Shrinkable */}
                        <div className="flex-shrink-0">
                            <Sidebar user={user} />
                        </div>

                        {/* Main Content: Grows to fill, scrolls internally */}
                        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-[var(--background)]">
                            {children}
                        </main>
                    </div>
                ) : (
                    // Login / Public Layout
                    <main className="h-full w-full flex items-center justify-center bg-[var(--background)]">
                        {children}
                    </main>
                )}

            </body>
        </html>
    );
}
