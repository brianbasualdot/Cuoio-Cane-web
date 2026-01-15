import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg" | "icon";
    loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    // BASE LAYOUT
                    "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-coffee-light/50 disabled:opacity-50 disabled:pointer-events-none",
                    "tracking-wide uppercase text-[11px]", // Atelier Typography

                    // RADIUS TOKEN
                    "rounded-token-md",

                    // SIZES
                    size === "sm" && "h-8 px-3",
                    size === "md" && "h-11 px-5", // Manifesto h-11
                    size === "lg" && "h-12 px-8",
                    size === "icon" && "h-10 w-10",

                    // VARIANTS
                    variant === "primary" && [
                        "bg-coffee hover:bg-coffee-light text-white shadow-elevation-1",
                        "border border-coffee-light/30"
                    ],
                    variant === "secondary" && [
                        "bg-surface border border-border text-[var(--text-primary)] hover:bg-surface-hover hover:border-border-subtle"
                    ],
                    variant === "ghost" && [
                        "bg-transparent hover:bg-surface-hover text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    ],
                    variant === "destructive" && [
                        "bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/30"
                    ],

                    className
                )}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
