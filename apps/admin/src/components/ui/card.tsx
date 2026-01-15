import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6', // Removed shadow, standardized props
                className
            )}
        >
            {children}
        </div>
    );
}
