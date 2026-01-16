import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-token-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coffee disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
    {
        variants: {
            variant: {
                default:
                    'bg-coffee text-white shadow hover:bg-coffee-light',
                destructive:
                    'bg-red-900/50 text-red-200 hover:bg-red-900/70 border border-red-900',
                outline:
                    'border border-border bg-transparent hover:bg-surface-hover text-zinc-300',
                secondary:
                    'bg-surface hover:bg-surface-hover text-zinc-200 border border-border-subtle',
                ghost: 'hover:bg-surface-hover text-zinc-400 hover:text-zinc-200',
                link: 'text-coffee underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-10 px-8',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        // When using asChild (Slot), we must ensure we only pass a single valid React Element as children.
        // Logic like {loading && <Icon />} {children} creates an array/fragment which Slot rejects.
        // Therefore, if asChild is true, we skip the internal loading rendering (it should be handled inside the child if needed)
        // or we simply render 'children'.

        if (asChild) {
            return (
                <Comp
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    disabled={loading || props.disabled}
                    {...props}
                >
                    {children}
                </Comp>
            );
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={loading || props.disabled}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
