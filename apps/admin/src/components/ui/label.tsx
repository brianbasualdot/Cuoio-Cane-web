import { cn } from "@/lib/utils";
import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, children, required, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-[11px] font-sans font-medium uppercase tracking-wide text-[var(--text-secondary)] mb-1.5 block select-none",
                    className
                )}
                {...props}
            >
                {children}
                {required && <span className="text-coffee ml-0.5">*</span>}
            </label>
        );
    }
);
Label.displayName = "Label";
