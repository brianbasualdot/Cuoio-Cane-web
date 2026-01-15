import { cn } from '@/lib/utils';
import { PackageOpen } from 'lucide-react'; // Default icon choice, can be overridden

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ElementType;
}

export function EmptyState({ title, description, action, icon: Icon = PackageOpen }: EmptyStateProps) {
    return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-[var(--border)] rounded-sm bg-[var(--surface)]/30">
            <div className="p-4 rounded-full bg-[var(--surface)] mb-6 border border-[var(--border)]">
                <Icon className="w-6 h-6 text-[var(--accent-copper)] opacity-60" />
            </div>
            <h3 className="text-sm font-medium text-[var(--text-primary)] tracking-wide mb-2">{title}</h3>
            {description && (
                <p className="text-xs text-[var(--text-secondary)] text-center max-w-xs mb-8 opacity-70 leading-relaxed">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
