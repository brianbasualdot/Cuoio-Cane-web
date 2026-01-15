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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState) {
            setIsCollapsed(JSON.parse(savedState));
        }

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    };

    if (isMobile) return null;

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 88 : 280 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 150, damping: 20 }}
            className="h-full bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-20 flex-shrink-0 relative group/sidebar"
        >
            {/* Header */}
            <div className={cn("h-20 flex items-center px-6 border-b border-[var(--border)]", isCollapsed ? "justify-center" : "justify-between")}>
                <AnimatePresence mode="popLayout">
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-mono text-[10px] font-bold text-[var(--accent-copper)] tracking-[0.3em] uppercase whitespace-nowrap"
                        >
                            CUOIO ATELIER
                        </motion.span>
                    )}
                </AnimatePresence>
                {isCollapsed && (
                    <span className="font-mono text-[10px] font-bold text-[var(--accent-copper)]">CA</span>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-8 space-y-10 scrollbar-thin overflow-x-hidden">

                {/* Principal Group */}
                <div className="px-4 space-y-2">
                    {!isCollapsed && <SectionLabel>Principal</SectionLabel>}
                    <NavItem href="/" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} active={pathname === '/'} />
                    <NavItem href="/orders" icon={ShoppingBag} label="Pedidos" isCollapsed={isCollapsed} active={pathname.startsWith('/orders')} />
                    <NavItem href="/products" icon={Package} label="Productos" isCollapsed={isCollapsed} active={pathname.startsWith('/products')} />
                    <NavItem href="/customers" icon={Users} label="Clientes" isCollapsed={isCollapsed} active={pathname === '/customers'} />
                </div>

                {/* Gestion Group */}
                <div className="px-4 space-y-2">
                    {!isCollapsed && <SectionLabel>Gestión</SectionLabel>}
                    <NavItem href="/categories" icon={Layers} label="Categorías" isCollapsed={isCollapsed} active={pathname === '/categories'} />
                    <NavItem href="/discounts" icon={Tag} label="Descuentos" isCollapsed={isCollapsed} active={pathname === '/discounts'} />
                    <NavItem href="/reports" icon={BarChart} label="Reportes" isCollapsed={isCollapsed} active={pathname === '/reports'} />
                </div>

                {/* Sistema Group */}
                <div className="px-4 space-y-2">
                    {!isCollapsed && <SectionLabel>Sistema</SectionLabel>}
                    <NavItem href="/integrations" icon={Share2} label="Integraciones" isCollapsed={isCollapsed} active={pathname === '/integrations'} />
                    <NavItem href="/settings" icon={Settings} label="Configuración" isCollapsed={isCollapsed} active={pathname === '/settings'} />
                </div>
            </div>

            {/* Footer / User */}
            <div className="p-6 border-t border-[var(--border)] mt-auto">
                <div className={cn("flex items-center gap-4", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="text-xs font-medium text-[var(--text-primary)] truncate tracking-wide">{user.email?.split('@')[0] || 'User'}</p>
                            <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Admin</p>
                        </div>
                    )}

                    <form action="/auth/signout" method="post">
                        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 rounded-sm hover:bg-[var(--surface-hover)] group">
                            <LogOut className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Collapse Trigger */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-24 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm hover:border-[var(--accent-copper)] transition-colors opacity-0 group-hover/sidebar:opacity-100 focus:opacity-100"
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
                "flex items-center gap-4 px-4 py-3 rounded-sm transition-all duration-300 group relative",
                isCollapsed ? "justify-center" : "justify-start",
                active
                    ? "bg-[var(--surface-hover)] text-[var(--text-primary)] shadow-[inset_2px_0_0_0_var(--accent-copper)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            )}
        >
            <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", active && "text-[var(--accent-copper)]")} />

            {!isCollapsed && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-normal tracking-wide whitespace-nowrap"
                >
                    {label}
                </motion.span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
                <div className="absolute left-full ml-5 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {label}
                </div>
            )}
        </Link>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 mt-6 mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-40 select-none">
            {children}
        </div>
    );
}
