import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar"; // Ensuring usage of our hardened sidebar

interface AdminLayoutProps {
    children: React.ReactNode;
    user: any; // User object from Supabase
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">

            {/* SIDEBAR SLOT: Fixed Width, Non-Shrink */}
            <div className="shrink-0">
                <Sidebar user={user} />
            </div>

            {/* MAIN CONTENT SLOT: Scrollable, Flex Grow */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
                {/* 
                    NOTE: We do NOT enforce padding here. 
                    Padding is the responsibility of the PageShell or internal Containers. 
                */}
                {children}
            </main>

        </div>
    );
}
