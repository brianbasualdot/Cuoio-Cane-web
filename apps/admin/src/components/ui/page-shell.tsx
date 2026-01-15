import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';

interface PageShellProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string; // Added support for subtitle
    action?: React.ReactNode;
    className?: string;
}

export function PageShell({ children, title, subtitle, action, className }: PageShellProps) {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            <Header title={title} subtitle={subtitle}>
                {action}
            </Header>

            <div className={cn("flex-1 overflow-y-auto px-8 py-8", className)}>
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
