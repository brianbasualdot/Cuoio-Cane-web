import './globals.css';
import { Inter, Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/sidebar';

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

export const metadata = {
    title: 'Cuoio Cane Admin',
    description: 'Atelier Management',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <html lang="es" className={`${inter.variable} ${cormorant.variable} ${playfair.variable}`}>
            <body className="h-screen bg-[var(--background)] text-[var(--text-primary)] flex overflow-hidden selection:bg-[var(--accent-copper)] selection:text-black font-sans">
                {user ? (
                    <>
                        <Sidebar user={user} />
                        <main className="flex-1 h-full overflow-y-auto bg-[var(--background)] relative flex flex-col">
                            {children}
                        </main>
                    </>
                ) : (
                    <main className="flex-1 h-full overflow-y-auto w-full">
                        {children}
                    </main>
                )}
            </body>
        </html>
    );
}
