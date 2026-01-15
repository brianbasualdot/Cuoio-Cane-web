import { cn } from "@/lib/utils";

interface AuthLayoutProps {
    children: React.ReactNode;
    className?: string; // Allow minor overrides if absolutely needed
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
    return (
        // VIEWPORT LOCK: No scroll, strictly centered
        <main className={cn(
            "h-screen w-screen overflow-hidden flex items-center justify-center bg-background relative",
            className
        )}>

            {/* AMBIENT LIGHTING (Fixed) */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, rgba(62, 39, 35, 0.1) 0%, transparent 70%)' }}
            />

            {/* CONTENT SLOT (Z-Index ensured) */}
            <div className="relative z-10 w-full flex justify-center p-4">
                {children}
            </div>

            {/* FOOTER / COPYRIGHT */}
            <div className="absolute bottom-6 opacity-30 text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
                Cuoio Cane Atelier System
            </div>

        </main>
    );
}
