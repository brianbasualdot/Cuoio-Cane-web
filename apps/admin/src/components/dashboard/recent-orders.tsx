'use client';

import { cn } from "@/lib/utils";

// Mock Data
const RECENT_ORDERS = [
    { id: 'ORD-001', customer: 'Sofía Martinez', product: 'Bolso Tote Cuero', amount: '$145.000', status: 'completed' },
    { id: 'ORD-002', customer: 'Lucas Perez', product: 'Cinturón Clásico', amount: '$42.000', status: 'pending' },
    { id: 'ORD-003', customer: 'Ana Garcia', product: 'Billetera Doble', amount: '$56.000', status: 'processing' },
    { id: 'ORD-004', customer: 'Miguel Angel', product: 'Morral Canvas', amount: '$110.000', status: 'completed' },
];

export function RecentOrders() {
    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col h-full min-h-[400px]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center">
                <h3 className="text-xs font-sans font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    Actividad Reciente
                </h3>
                <button className="text-[10px] text-[var(--accent-copper)] hover:text-[#e4c493] uppercase tracking-wider font-medium transition-colors">
                    Ver Todo
                </button>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--surface-hover)]/30 border-b border-[var(--border)]">
                            <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] w-[100px]">ID</th>
                            <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Cliente</th>
                            <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] hidden md:table-cell">Producto</th>
                            <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Estado</th>
                            <th className="px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] text-right">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {RECENT_ORDERS.map((order) => (
                            <tr key={order.id} className="group hover:bg-[var(--surface-hover)] transition-colors">
                                <td className="px-6 py-4 text-xs font-mono text-[var(--text-secondary)]">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-[var(--text-primary)] font-medium block">{order.customer}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--text-secondary)] hidden md:table-cell">
                                    {order.product}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-[var(--text-primary)] text-right">
                                    {order.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        completed: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        processing: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    };

    const labels: Record<string, string> = {
        completed: "Completado",
        pending: "Pendiente",
        processing: "Procesando",
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border",
            styles[status] || styles.pending
        )}>
            {labels[status] || status}
        </span>
    );
}
