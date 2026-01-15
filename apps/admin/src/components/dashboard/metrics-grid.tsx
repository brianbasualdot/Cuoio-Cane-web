'use client';

import { DollarSign, ShoppingBag, Package } from 'lucide-react';
import { MetricCard } from './metric-card';

interface MetricsGridProps {
    productsCount: number;
    ordersCount: number;
}

export function MetricsGrid({ productsCount, ordersCount }: MetricsGridProps) {
    return (
        // GRID: Rigid 3 columns, consistent gap
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
                title="Ingresos Totales"
                value={ordersCount * 1500} // Mock calc for demo
                icon={DollarSign}
                prefix="$"
                trend="+12.5%"
            />
            <MetricCard
                title="Stock Activo"
                value={productsCount || 48}
                icon={Package}
                trend="+2"
            />
            <MetricCard
                title="Pendientes"
                value={3}
                icon={ShoppingBag}
                isHighlight
            />
        </div>
    );
}
