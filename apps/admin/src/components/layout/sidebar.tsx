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
    Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    user: any;
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        // CONTAINER: Rigid 260px Width, Full Height, Fixed Border
        <aside className="w-[260px] h-full flex flex-col bg-[var(--surface)] border-r border-[var(--border)] text-[var(--text-secondary)]">

            {/* HEADER: Rigid Height (80px), Padding */}
            <div className="h-20 flex flex-col justify-center px-6 border-b border-[var(--border)] shrink-0">
                <span className="font-serif-title text-xl text-[var(--text-primary)] tracking-tight">
                    Cuoio Cane
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] opacity-60 mt-0.5">
                    Atelier Admin
                </span>
            </div>

            {/* SCROLLABLE NAV: Flex Grow, Safe Overflow */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">

                {/* GROUP 1: Principal */}
                <div className="space-y-1">
                    <div className="px-3 mb-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent-copper)] opacity-80">
                            Principal
                        </span>
                    </div>
                    <NavItem href="/" icon={LayoutDashboard} label="Dashboard" active={pathname === '/'} />
                    <NavItem href="/orders" icon={ShoppingBag} label="Pedidos" active={pathname.startsWith('/orders')} />
                    <NavItem href="/products" icon={Package} label="Productos" active={pathname.startsWith('/products')} />
                    <NavItem href="/customers" icon={Users} label="Clientes" active={pathname.startsWith('/customers')} />
                </div>

                {/* GROUP 2: Gestión */}
                <div className="space-y-1">
                    <div className="px-3 mb-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent-copper)] opacity-80">
                            Gestión
                        </span>
                    </div>
                    <NavItem href="/categories" icon={Layers} label="Categorías" active={pathname.startsWith('/categories')} />
                    <NavItem href="/discounts" icon={Tag} label="Descuentos" active={pathname.startsWith('/discounts')} />
                    <NavItem href="/reports" icon={BarChart} label="Reportes" active={pathname.startsWith('/reports')} />
                </div>

                {/* GROUP 3: Sistema */}
                <div className="space-y-1">
                    <div className="px-3 mb-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent-copper)] opacity-80">
                            Sistema
                        </span>
                    </div>
                    <NavItem href="/integrations" icon={Share2} label="Integraciones" active={pathname.startsWith('/integrations')} />
                    <NavItem href="/settings" icon={Settings} label="Configuración" active={pathname.startsWith('/settings')} />
                </div>

            </nav>

            {/* FOOTER: User Profile, Rigid Height */}
            <div className="p-5 border-t border-[var(--border)] bg-[var(--background)] shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col overflow-hidden mr-2">
                        <span className="font-medium text-xs text-[var(--text-primary)] truncate">
                            {user?.email?.split('@')[0] || 'Administrator'}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider opacity-60">
                            Sesión Activa
                        </span>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="p-2 rounded hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

        </aside>
    );
}

// NAV ITEM SUBCOMPONENT
function NavItem({ href, icon: Icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium tracking-wide transition-all duration-200",
                active
                    ? "bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] shadow-sm"
                    : "hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] border border-transparent"
            )}
        >
            <Icon className={cn("w-4 h-4", active ? "text-[var(--accent-copper)]" : "opacity-70")} />
            <span>{label}</span>
        </Link>
    );
}
