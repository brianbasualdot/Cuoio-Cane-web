import { Card } from '@/components/ui/CardContainer';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Ban } from 'lucide-react';

interface SalesStats {
    totalCount: number;
    totalRevenue: number;
    cancelledCount: number;
    cancelledRevenue: number;
    netRevenue: number;
    averageTicket: number;
    minTicket: number;
    maxTicket: number;
}

export function SummaryCards({ data }: { data: SalesStats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Ventas Totales"
                value={formatCurrency(data.totalRevenue)}
                subtitle={`${data.totalCount} pedidos`}
                icon={DollarSign}
                trend="neutral"
            />
            <StatCard
                title="Ventas Netas"
                value={formatCurrency(data.netRevenue)}
                subtitle="Ingresos reales"
                icon={TrendingUp}
                trend="positive"
            />
            <StatCard
                title="Ticket Promedio"
                value={formatCurrency(data.averageTicket)}
                subtitle={`Min: ${formatCurrency(data.minTicket)} | Max: ${formatCurrency(data.maxTicket)}`}
                icon={ShoppingCart}
                trend="neutral"
            />
            <StatCard
                title="Cancelados"
                value={formatCurrency(data.cancelledRevenue)}
                subtitle={`${data.cancelledCount} pedidos rechazados`}
                icon={Ban}
                trend="negative"
            />
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, trend }: any) {
    return (
        <Card className="p-6 border-border-subtle bg-surface flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
                </div>
                <div className={cn("p-2 rounded-full",
                    trend === 'positive' ? "bg-emerald-500/10 text-emerald-500" :
                        trend === 'negative' ? "bg-red-500/10 text-red-500" :
                            "bg-zinc-800 text-zinc-400"
                )}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <div className="text-2xl font-display font-semibold text-white mb-1">{value}</div>
                <div className="text-xs text-zinc-500 font-light">{subtitle}</div>
            </div>
        </Card>
    );
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(value);
}
