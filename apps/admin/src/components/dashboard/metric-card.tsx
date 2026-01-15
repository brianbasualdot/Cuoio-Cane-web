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
            "relative p-6 rounded-lg border transition-colors duration-200 group overflow-hidden h-[140px] flex flex-col justify-between",
            isHighlight
                ? "bg-[var(--surface)] border-[var(--accent-coffee-light)]"
                : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-light)]"
        )}>

            {/* TOP ROW: Icon & Title */}
            <div className="flex items-start justify-between">
                <h3 className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-1">
                    {title}
                </h3>
                <div className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isHighlight ? "bg-[rgba(62,39,35,0.4)] text-[var(--accent-copper)]" : "bg-[var(--surface-hover)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                )}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>

            {/* BOTTOM ROW: Value & Trend */}
            <div className="flex items-end justify-between">
                <div className="font-serif-title text-4xl font-normal text-[var(--text-primary)] leading-none -mb-1">
                    {typeof value === 'number' ? <CountUp value={value} prefix={prefix} /> : <>{prefix}{value}</>}
                </div>

                {trend && (
                    <span className={cn(
                        "text-[10px] font-mono font-medium py-0.5 px-1.5 rounded bg-[var(--surface-hover)] border border-[var(--border)]",
                        trend.startsWith('+') ? "text-emerald-500/80" : "text-rose-500/80"
                    )}>
                        {trend}
                    </span>
                )}
            </div>

        </div>
    );
}
