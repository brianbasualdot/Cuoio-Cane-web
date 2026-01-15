'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CountUp from "@/components/ui/count-up";

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    prefix?: string;
    trend?: string;
    isHighlight?: boolean;
}

export function MetricCard({ title, value, icon: Icon, prefix = '', trend, isHighlight }: MetricCardProps) {
    return (
        <div className={cn(
            "relative p-5 rounded-sm border transition-all duration-300 group overflow-hidden",
            isHighlight
                ? "bg-[var(--surface)] border-[var(--accent-copper)] shadow-[0_4px_20px_-10px_rgba(212,180,131,0.1)]"
                : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text-secondary)]"
        )}>
            {/* Background Texture/Glow */}
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--surface-hover)] to-transparent opacity-0 transition-opacity duration-500 rounded-bl-full pointer-events-none",
                "group-hover:opacity-100"
            )} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xs font-sans font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                        {title}
                    </h3>
                    <div className={cn(
                        "p-2 rounded-full",
                        isHighlight ? "bg-[rgba(212,180,131,0.1)] text-[var(--accent-copper)]" : "bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                    )}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>

                <div className="flex items-end gap-2">
                    <div className="font-serif-title text-4xl font-normal text-[var(--text-primary)] leading-none">
                        {typeof value === 'number' ? <CountUp value={value} prefix={prefix} /> : <>{prefix}{value}</>}
                    </div>
                    {trend && (
                        <span className={cn(
                            "text-xs font-sans font-medium mb-1",
                            trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
