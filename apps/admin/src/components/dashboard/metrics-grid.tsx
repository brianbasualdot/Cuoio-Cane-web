'use client';

import { DollarSign, ShoppingBag, Package } from 'lucide-react';
import { MetricCard } from './metric-card';

interface MetricsGridProps {
    productsCount: number;
    ordersCount: number;
}

export function MetricsGrid({ productsCount, ordersCount }: MetricsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
                title="Ventas Totales"
                value={ordersCount || 1240}
                icon={DollarSign}
                prefix="$"
                trend="+12.5%"
            />
            <MetricCard
                title="Productos Activos"
                value={productsCount || 48}
                icon={Package}
                trend="+2"
            />
            <MetricCard
                title="Pedidos Pendientes"
                value={3}
                icon={ShoppingBag}
                isHighlight
            />
        </div>
    );
}
