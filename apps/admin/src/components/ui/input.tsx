import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    // LAYOUT
                    "flex w-full bg-background px-4 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium",

                    // HEIGHT (Manifesto strict)
                    "h-11",

                    // BORDERS & RADIUS
                    "rounded-token-md border border-border",

                    // TYPOGRAPHY
                    "text-sm font-sans placeholder:text-[var(--text-muted)]",

                    // STATES
                    "focus-visible:outline-none focus-visible:border-coffee-light focus-visible:ring-1 focus-visible:ring-coffee-light/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "transition-colors duration-200",

                    // ERROR
                    error && "border-red-900/50 focus-visible:border-red-500/50",

                    className
                )}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";
