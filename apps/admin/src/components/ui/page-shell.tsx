import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';

interface PageShellProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string; // Additional classes for the inner container
}

export function PageShell({ children, title, subtitle, action, className }: PageShellProps) {
    return (
        <div className="flex flex-col h-full w-full">

            {/* GLOBAL HEADER HEADER: Reused logic, rigid placement */}
            <Header title={title} subtitle={subtitle}>
                {action}
            </Header>

            {/* CONTENT AREA: Scrollable, Restricted Width */}
            <div className="flex-1 overflow-y-auto bg-[var(--background)]">
                <div className="w-full max-w-7xl mx-auto p-10 space-y-8">
                    {/* INJECTED PAGE CONTENT */}
                    <div className={cn("animate-in fade-in slide-in-from-bottom-2 duration-500", className)}>
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
}
