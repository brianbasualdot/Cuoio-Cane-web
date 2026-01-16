'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextType {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}
const DropdownContext = React.createContext<DropdownContextType>({ isOpen: false, setIsOpen: () => { } });

export function DropdownMenu({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
            <div ref={containerRef} className="relative inline-block text-left">
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

export function DropdownMenuTrigger({ asChild, children, className }: any) {
    const { isOpen, setIsOpen } = React.useContext(DropdownContext);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                // Safe call to existing onClick
                if (children.props && 'onClick' in children.props) {
                    (children.props as any).onClick?.(e);
                }
                setIsOpen(!isOpen);
            }
        });
    }

    return (
        <button onClick={() => setIsOpen(!isOpen)} className={className}>
            {children}
        </button>
    );
}

export function DropdownMenuContent({ children, align = 'end', className }: any) {
    const { isOpen } = React.useContext(DropdownContext);

    if (!isOpen) return null;

    return (
        <div className={cn(
            "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-border-subtle bg-surface p-1 text-zinc-200 shadow-md animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
            align === 'end' ? 'right-0' : 'left-0',
            className
        )}>
            {children}
        </div>
    );
}

export function DropdownMenuItem({ asChild, children, className, ...props }: any) {
    const { setIsOpen } = React.useContext(DropdownContext);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            className: cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-white/5 focus:bg-white/5 data-[disabled]:opacity-50", className),
            onClick: (e: any) => {
                if (children.props && 'onClick' in children.props) {
                    (children.props as any).onClick?.(e);
                }
                setIsOpen(false);
            }
        });
    }

    return (
        <div
            className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-white/5 focus:bg-white/5 data-[disabled]:opacity-50", className)}
            onClick={() => setIsOpen(false)}
            {...props}
        >
            {children}
        </div>
    );
}

export function DropdownMenuLabel({ children, className }: any) {
    return <div className={cn("px-2 py-1.5 text-sm font-semibold text-zinc-400", className)}>{children}</div>;
}

export function DropdownMenuSeparator({ className }: any) {
    return <div className={cn("-mx-1 my-1 h-px bg-border-subtle", className)} />;
}
