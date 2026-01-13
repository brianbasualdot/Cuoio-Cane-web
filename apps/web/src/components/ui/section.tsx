import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    container?: boolean;
    bleed?: boolean; // Full width background
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, children, container = true, bleed = false, ...props }, ref) => {
        // If bleed is true, we apply bg to outer, but if container is true we constrain content
        return (
            <section
                ref={ref}
                className={cn(
                    "py-20 relative",
                    className
                )}
                {...props}
            >
                {container ? (
                    <div className="container px-4 mx-auto">
                        {children}
                    </div>
                ) : (
                    children
                )}
            </section>
        )
    }
)
Section.displayName = "Section"

export { Section }
