'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Calendar } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }));
    }, []);

    return (
        <header className="h-[88px] flex items-center justify-between px-8 border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-10">
            {/* Title & Context */}
            <div>
                <h1 className="text-3xl font-serif text-[var(--text-primary)] tracking-wide">{title}</h1>
                {subtitle && (
                    <p className="text-xs font-sans text-[var(--accent-copper)] tracking-widest uppercase mt-1 opacity-80">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Central Actions / Search */}
            <div className="flex-1 max-w-xl mx-12">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] opacity-50 group-focus-within:opacity-100 group-focus-within:text-[var(--accent-copper)] transition-all" />
                    <input
                        type="text"
                        placeholder="Buscar en el sistema..."
                        className="w-full bg-[var(--surface-hover)]/50 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 rounded-sm py-2 pl-10 pr-4 border border-[var(--border)] focus:border-[var(--accent-copper)] focus:outline-none focus:ring-0 transition-all font-sans"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {children}

                <div className="h-6 w-px bg-[var(--border)] mx-2" />

                <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent-copper)] rounded-full border-2 border-[var(--background)]"></span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{date}</span>
                </div>
            </div>
        </header>
    );
}
