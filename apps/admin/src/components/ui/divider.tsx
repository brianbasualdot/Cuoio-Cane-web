import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical";
}

export function Divider({
    className,
    orientation = "horizontal",
    ...props
}: DividerProps) {
    return (
        <div
            className={cn(
                "bg-border", // Strict border color
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className
            )}
            {...props}
        />
    );
}
