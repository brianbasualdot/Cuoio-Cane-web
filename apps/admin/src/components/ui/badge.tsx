import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "outline";
    className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium uppercase tracking-wider border",

            // VARIANTS
            variant === "default" && "bg-surface text-[var(--text-secondary)] border-border",
            variant === "outline" && "bg-transparent text-[var(--text-primary)] border-border",

            // STATUS COLORS (Hardened, no random tailwind colors)
            variant === "success" && "text-emerald-400 bg-emerald-950/30 border-emerald-900/50",
            variant === "warning" && "text-amber-400 bg-amber-950/30 border-amber-900/50",
            variant === "error" && "text-red-400 bg-red-950/30 border-red-900/50",

            className
        )}>
            {children}
        </span>
    );
}
