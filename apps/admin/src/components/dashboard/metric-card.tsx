import CountUp from "@/components/ui/count-up";

interface MetricCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    prefix?: string;
}

export function MetricCard({ title, value, icon: Icon, prefix }: MetricCardProps) {
    return (
        <div className="bg-[var(--surface)] p-8 rounded-sm border border-[var(--border)] flex items-start justify-between group hover:border-[var(--text-secondary)] transition-all duration-500">
            <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-60">
                    {title}
                </p>
                <p className="text-4xl font-light text-[var(--text-primary)] tracking-tight">
                    <CountUp value={value} prefix={prefix} />
                </p>
            </div>
            <div className="p-3 bg-[var(--surface-hover)] rounded-md opacity-40 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0 group-hover:rotate-12 group-hover:scale-110">
                <Icon className="w-5 h-5 text-[var(--accent-copper)]" />
            </div>
        </div>
    );
}
