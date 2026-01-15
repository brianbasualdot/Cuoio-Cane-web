'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Settings,
    LogOut,
    Layers,
    BarChart,
    Tag,
    Share2,
    Box
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    user: any;
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-[280px] h-full bg-[var(--background)] border-r border-[var(--border)] flex flex-col z-20 flex-shrink-0 relative">
            {/* Header / Logo */}
            <div className="h-[88px] flex items-center px-8 border-b border-[var(--border)]">
                <div className="flex flex-col">
                    <span className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-none">Cuoio Cane</span>
                    <span className="font-sans text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-1 pl-0.5">Atelier Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-8 px-4 space-y-10 scrollbar-thin">

                {/* Principal Group */}
                <div className="space-y-1">
                    <SectionLabel>Principal</SectionLabel>
                    <NavItem href="/" icon={LayoutDashboard} label="Dashboard" active={pathname === '/'} />
                    <NavItem href="/orders" icon={ShoppingBag} label="Pedidos" active={pathname.startsWith('/orders')} />
                    <NavItem href="/products" icon={Package} label="Productos" active={pathname.startsWith('/products')} />
                    <NavItem href="/customers" icon={Users} label="Clientes" active={pathname === '/customers'} />
                </div>

                {/* Gestion Group */}
                <div className="space-y-1">
                    <SectionLabel>Gestión</SectionLabel>
                    <NavItem href="/categories" icon={Layers} label="Categorías" active={pathname === '/categories'} />
                    <NavItem href="/discounts" icon={Tag} label="Descuentos" active={pathname === '/discounts'} />
                    <NavItem href="/reports" icon={BarChart} label="Reportes" active={pathname === '/reports'} />
                </div>

                {/* Sistema Group */}
                <div className="space-y-1">
                    <SectionLabel>Sistema</SectionLabel>
                    <NavItem href="/integrations" icon={Share2} label="Integraciones" active={pathname === '/integrations'} />
                    <NavItem href="/settings" icon={Settings} label="Configuración" active={pathname === '/settings'} />
                </div>
            </div>

            {/* Footer / User */}
            <div className="p-6 border-t border-[var(--border)] mt-auto bg-[var(--surface)]">
                <div className="flex items-center justify-between">
                    <div className="overflow-hidden">
                        <p className="font-serif text-sm text-[var(--text-primary)] truncate tracking-wide">{user.user_metadata?.first_name || user.email?.split('@')[0] || 'Atelier User'}</p>
                        <p className="text-[10px] text-[var(--accent-copper)] uppercase tracking-wider mt-0.5 font-medium">Administrator</p>
                    </div>

                    <form action="/auth/signout" method="post">
                        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 rounded-sm hover:bg-[var(--surface-hover)] group">
                            <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, icon: Icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-sm transition-all duration-300 group relative font-sans",
                active
                    ? "bg-[var(--surface)] text-[var(--text-primary)] border-l-2 border-[var(--accent-copper)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] border-l-2 border-transparent"
            )}
        >
            <Icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", active ? "text-[var(--accent-copper)]" : "opacity-70 group-hover:opacity-100")} />
            <span className={cn("text-sm tracking-wide transform transition-transform duration-300", active ? "font-medium translate-x-1" : "font-normal group-hover:translate-x-1")}>
                {label}
            </span>
        </Link>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 mt-4 mb-2">
            <h3 className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] select-none">
                {children}
            </h3>
        </div>
    );
}
