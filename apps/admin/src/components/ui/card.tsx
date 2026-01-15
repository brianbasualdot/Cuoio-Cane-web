import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "hoverable" | "flat";
    noPadding?: boolean;
}

export function Card({
    children,
    className,
    variant = "default",
    noPadding = false,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-token-lg border transition-all duration-200",
                // BASE STYLES
                "bg-surface text-[var(--text-primary)]",

                // VARIANTS
                variant === "default" && "border-border shadow-elevation-1",
                variant === "hoverable" && "border-border hover:border-border-subtle hover:bg-surface-hover cursor-pointer shadow-elevation-1 hover:shadow-elevation-2",
                variant === "flat" && "border-transparent bg-transparent shadow-none",

                // PADDING (Explicit or None)
                !noPadding && "p-6",

                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
