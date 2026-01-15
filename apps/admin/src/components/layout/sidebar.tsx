'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Settings,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
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
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState) {
            setIsCollapsed(JSON.parse(savedState));
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 256 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
            className="h-screen sticky top-0 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-20 flex-shrink-0"
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border)]">
                <AnimatePresence mode="popLayout">
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-mono text-[10px] font-bold text-[var(--accent-copper)] tracking-[0.25em] uppercase whitespace-nowrap"
                        >
                            CUOIO ATELIER
                        </motion.span>
                    )}
                </AnimatePresence>
                {isCollapsed && (
                    <span className="font-mono text-[10px] font-bold text-[var(--accent-copper)] mx-auto">CA</span>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-thin">

                {/* Principal Group */}
                <div className="px-3 space-y-1">
                    {/* No Label for main group, as per Notion style usually, or 'Main' */}
                    <NavItem href="/" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} active={pathname === '/'} />
                    <NavItem href="/orders" icon={ShoppingBag} label="Pedidos" isCollapsed={isCollapsed} active={pathname.startsWith('/orders')} />
                    <NavItem href="/products" icon={Package} label="Productos" isCollapsed={isCollapsed} active={pathname.startsWith('/products')} />
                    <NavItem href="/customers" icon={Users} label="Clientes" isCollapsed={isCollapsed} active={pathname === '/customers'} />
                </div>

                {/* Gestion Group */}
                <div className="px-3 space-y-1">
                    {!isCollapsed && <SectionLabel>Gestión</SectionLabel>}
                    <NavItem href="/categories" icon={Layers} label="Categorías" isCollapsed={isCollapsed} active={pathname === '/categories'} />
                    <NavItem href="/discounts" icon={Tag} label="Descuentos" isCollapsed={isCollapsed} active={pathname === '/discounts'} />
                    <NavItem href="/reports" icon={BarChart} label="Reportes" isCollapsed={isCollapsed} active={pathname === '/reports'} />
                </div>

                {/* Sistema Group */}
                <div className="px-3 space-y-1">
                    {!isCollapsed && <SectionLabel>Sistema</SectionLabel>}
                    <NavItem href="/integrations" icon={Share2} label="Integraciones" isCollapsed={isCollapsed} active={pathname === '/integrations'} />
                    <NavItem href="/settings" icon={Settings} label="Configuración" isCollapsed={isCollapsed} active={pathname === '/settings'} />
                </div>
            </div>

            {/* Footer / User */}
            <div className="p-4 border-t border-[var(--border)] mt-auto">
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="text-[11px] font-medium text-[var(--text-primary)] truncate">{user.email?.split('@')[0] || 'User'}</p>
                            <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Admin</p>
                        </div>
                    )}

                    <form action="/auth/signout" method="post">
                        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 rounded-sm hover:bg-[var(--surface-hover)] group">
                            <LogOut className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Collapse Trigger */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm hover:border-[var(--accent-copper)] transition-colors"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

        </motion.aside>
    );
}

function NavItem({ href, icon: Icon, label, isCollapsed, active }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200 group relative",
                active
                    ? "bg-[var(--surface-hover)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            )}
        >
            <Icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", active && "text-[var(--accent-copper)]")} />

            {!isCollapsed && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[13px] font-medium whitespace-nowrap"
                >
                    {label}
                </motion.span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--surface)] border border-[var(--border)] text-[10px] text-[var(--text-primary)] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {label}
                </div>
            )}
        </Link>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-3 py-2 mt-4 text-[9px] font-mono font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50">
            {children}
        </div>
    );
}
