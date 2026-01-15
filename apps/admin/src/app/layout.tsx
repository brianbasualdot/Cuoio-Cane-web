import './globals.css';
import { Inter } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'] });

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
        <html lang="es">
            <body className={`${inter.className} h-screen bg-[var(--background)] text-[var(--text-primary)] flex overflow-hidden selection:bg-[var(--accent-copper)] selection:text-black`}>
                {user ? (
                    <>
                        <Sidebar user={user} />
                        <main className="flex-1 h-full overflow-y-auto bg-[var(--background)] relative">
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
