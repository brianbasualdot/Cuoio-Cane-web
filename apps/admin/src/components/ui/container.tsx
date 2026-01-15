import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl" | "full";
    centered?: boolean;
}

export function Container({
    children,
    className,
    size = "lg",
    centered = true,
    ...props
}: ContainerProps) {

    // STRICT WIDTH MAP (No magic numbers)
    const sizes = {
        sm: "max-w-screen-sm", // 640px
        md: "max-w-screen-md", // 768px
        lg: "max-w-screen-lg", // 1024px
        xl: "max-w-7xl",       // 1280px (Matches PageShell)
        full: "max-w-full",
    };

    return (
        <div
            className={cn(
                "w-full px-6 md:px-8", // Strict horizontal padding
                sizes[size],
                centered && "mx-auto",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
