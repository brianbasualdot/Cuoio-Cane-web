import { cn } from '@/lib/utils';

interface PageShellProps {
    children: React.ReactNode;
    title: string;
    action?: React.ReactNode;
    className?: string;
}

export function PageShell({ children, title, action, className }: PageShellProps) {
    return (
        <div className={cn("min-h-full flex flex-col p-8 md:p-12 space-y-8 animate-in fade-in duration-500", className)}>
            <div className="flex items-center justify-between">
                <h1 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">
                    {title}
                </h1>
                {action && <div>{action}</div>}
            </div>

            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
