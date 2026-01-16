import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-zinc-200">
            <Sidebar />
            <div className="pl-64">
                <Header />
                <main className="p-8 animate-in fade-in duration-300 slide-in-from-bottom-2">
                    {children}
                </main>
            </div>
        </div>
    );
}
