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
    LogOut
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

export function Sidebar() {
    const pathname = usePathname();

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
                <NavGroup title="Sistema" items={SYSTEM_NAV} pathname={pathname} />
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
