import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/AdminHeader';
import { AliasConfirmationModal } from '@/components/auth/AliasConfirmationModal';

export default async function AdminLayout({
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
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        userRole = profile?.role || null;
    }

    return (
        <div className="min-h-screen bg-background text-zinc-200">
            <Sidebar userRole={userRole} />
            <AliasConfirmationModal />
            <div className="pl-64">
                <Header />
                <main className="p-8 animate-in fade-in duration-300 slide-in-from-bottom-2">
                    {children}
                </main>
            </div>
        </div>
    );
}
