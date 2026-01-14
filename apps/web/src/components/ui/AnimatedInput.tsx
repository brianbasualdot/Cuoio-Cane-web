'use client';

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { inputVariants, errorTextVariants } from "@/lib/motion/checkout"

export interface AnimatedInputProps extends Omit<HTMLMotionProps<"input">, "ref"> {
    error?: string;
    label?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
    ({ className, type, error, label, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">
                        {label}
                    </label>
                )}
                <motion.div
                    initial="idle"
                    animate={error ? "error" : isFocused ? "focused" : "idle"}
                    variants={inputVariants}
                    className="relative"
                >
                    <motion.input
                        type={type}
                        className={cn(
                            "flex w-full border-b bg-transparent px-0 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            className
                        )}
                        style={{ borderBottomWidth: '1px', borderStyle: 'solid' }}
                        ref={ref}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        {...props}
                    />
                </motion.div>
                {error && (
                    <motion.p
                        variants={errorTextVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-xs text-red-500 mt-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        )
    }
)
AnimatedInput.displayName = "AnimatedInput"

export { AnimatedInput }
