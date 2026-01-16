'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    ShoppingBag,
    Package,
    Users,
    Layers,
    TicketPercent,
    Settings,
    Puzzle,
    LogOut,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signout } from '@/app/actions';

const MAIN_NAV = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
    { name: 'Productos', href: '/productos', icon: Package },
    { name: 'Clientes', href: '/clientes', icon: Users },
];

const MANAGEMENT_NAV = [
    { name: 'Categorías', href: '/categorias', icon: Layers },
    { name: 'Descuentos', href: '/descuentos', icon: TicketPercent },
];

const SYSTEM_NAV = [
    { name: 'Integraciones', href: '/integraciones', icon: Puzzle },
    { name: 'Configuración', href: '/configuracion', icon: Settings },
];

function NavGroup({ title, items, pathname }: { title?: string; items: typeof MAIN_NAV; pathname: string }) {
    return (
        <div className="mb-6">
            {title && (
                <h4 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    {title}
                </h4>
            )}
            <ul className="space-y-1">
                {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-token-md px-4 py-2 text-sm transition-colors',
                                    isActive
                                        ? 'bg-surface-hover text-white font-medium'
                                        : 'text-zinc-400 hover:bg-surface-hover hover:text-zinc-200'
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// Note: We need to update Sidebar to accept 'role' and filter items.
// Since Sidebar is currently a Client Component used in Layout, we should probably 
// pass the role from the (admin)/layout.tsx or fetch it. 
// Given the current architecture, (admin)/layout.tsx is a server component that can fetch the role.

export function Sidebar({ userRole }: { userRole?: string | null }) {
    const pathname = usePathname();

    // Filter System Nav based on role
    // const systemNav = [...SYSTEM_NAV];

    if (userRole === 'admin') {
        // Add metrics if admin. 
        // Or if it's already in the list, just ensure we use a filtered list.
        // Let's assume we want to push it or define it.
    }

    // Better approach: Define METRICS_NAV and only show if admin.

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border-base bg-background px-4 py-6">
            <div className="mb-8 px-4">
                <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                    Cuoio Cane
                    <span className="block text-xs font-sans font-normal text-zinc-500 tracking-widest mt-1">ADMIN</span>
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto">
                <NavGroup items={MAIN_NAV} pathname={pathname} />
                <NavGroup title="Gestión" items={MANAGEMENT_NAV} pathname={pathname} />

                <div className="mb-6">
                    <h4 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                        Sistema
                    </h4>
                    <ul className="space-y-1">
                        {userRole === 'admin' && (
                            <li>
                                <Link
                                    href="/metrics"
                                    className={cn(
                                        'flex items-center gap-3 rounded-token-md px-4 py-2 text-sm transition-colors',
                                        pathname === '/metrics'
                                            ? 'bg-surface-hover text-white font-medium'
                                            : 'text-zinc-400 hover:bg-surface-hover hover:text-zinc-200'
                                    )}
                                >
                                    <Activity className="h-4 w-4" />
                                    Métricas
                                </Link>
                            </li>
                        )}
                        {SYSTEM_NAV.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-token-md px-4 py-2 text-sm transition-colors',
                                            isActive
                                                ? 'bg-surface-hover text-white font-medium'
                                                : 'text-zinc-400 hover:bg-surface-hover hover:text-zinc-200'
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-border-subtle">
                <button
                    onClick={() => signout()}
                    className="flex w-full items-center gap-3 rounded-token-md px-4 py-2 text-sm text-zinc-500 transition-colors hover:text-red-400"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
