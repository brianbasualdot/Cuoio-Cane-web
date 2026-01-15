import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-sm',
                className
            )}
        >
            {children}
        </div>
    );
}
