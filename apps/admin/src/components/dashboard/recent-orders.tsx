'use client';

import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock data to match "Recent Activity" reference
const recentOrders = [
    { id: '#CC-1024', customer: 'Andrea Rossi', product: 'Collar Cuero Trenzado (Negro)', date: 'Hace 2 min', status: 'Pagado', amount: '$150.00' },
    { id: '#CC-1023', customer: 'Isabella Moretti', product: 'Correa Ajustable (Cobre)', date: 'Hace 45 min', status: 'Enviado', amount: '$85.00' },
    { id: '#CC-1022', customer: 'Luca Bianchi', product: 'Kit Paseo Premium', date: 'Hace 2 horas', status: 'Entregado', amount: '$210.00' },
    { id: '#CC-1021', customer: 'Sofia Ferrari', product: 'Collar Personalizado', date: 'Ayer', status: 'Pagado', amount: '$120.00' },
    { id: '#CC-1020', customer: 'Marco Conti', product: 'Pack Accesorios', date: 'Ayer', status: 'Pendiente', amount: '$95.00' },
];

export function RecentOrders() {
    return (
        <div className="h-full bg-[var(--surface)] border border-[var(--border)] rounded-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">Actividad Reciente</h3>
                <Link href="/orders" className="text-xs text-[var(--accent-copper)] hover:text-[var(--text-primary)] transition-colors">Ver todo</Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--border)]">
                            <th className="text-left pb-3 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Pedido</th>
                            <th className="text-left pb-3 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Cliente</th>
                            <th className="text-right pb-3 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Estado</th>
                            <th className="text-right pb-3 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-medium">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="group cursor-pointer hover:bg-[var(--surface-hover)] transition-colors">
                                <td className="py-3 pr-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-[var(--text-primary)] font-mono">{order.id}</span>
                                        <span className="text-[10px] text-[var(--text-secondary)] truncate max-w-[120px]">{order.product}</span>
                                    </div>
                                </td>
                                <td className="py-3 pr-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-[var(--text-primary)]">{order.customer}</span>
                                        <span className="text-[10px] text-[var(--text-muted)]">{order.date}</span>
                                    </div>
                                </td>
                                <td className="py-3 text-right">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="py-3 pl-4 text-right">
                                    <span className="text-xs font-medium text-[var(--text-primary)] font-mono">{order.amount}</span>
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
    const styles = {
        'Pagado': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        'Enviado': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        'Entregado': 'text-[var(--text-secondary)] bg-[var(--border)] border-transparent',
        'Pendiente': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    };

    const style = styles[status as keyof typeof styles] || styles['Entregado'];

    return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border uppercase tracking-wider", style)}>
            {status}
        </span>
    );
}
