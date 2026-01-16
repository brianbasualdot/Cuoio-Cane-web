'use client';

import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function Header() {
    const pathname = usePathname();
    // Simple breadcrumb logic or title extraction
    const getTitle = () => {
        if (pathname === '/') return 'Resumen';
        const parts = pathname.split('/').filter(Boolean);
        return parts.length > 0 ? parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1) : 'Admin';
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border-base bg-background/80 px-8 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
                    {getTitle().replace(/-/g, ' ')}
                </h2>
            </div>
            <div>
                {/* Placeholder for future user menu or notifications */}
                <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
            </div>
        </header>
    );
}
