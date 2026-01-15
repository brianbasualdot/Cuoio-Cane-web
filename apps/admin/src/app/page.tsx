import { createClient } from '@/lib/supabase/server';
import { DollarSign, ShoppingBag, Package } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { ActivityChart } from '@/components/dashboard/activity-chart';

export default async function Dashboard() {
  const supabase = await createClient();

  // Metrics Fetching (Parallel)
  const [
    { count: productsCount },
    { count: ordersCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-[1920px] mx-auto animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-[var(--text-primary)] mb-2">Cuoio Terminal</h1>
          <p className="text-[10px] text-[var(--text-secondary)] font-mono opacity-60">System Ready • v2.0.0</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] font-mono bg-[var(--surface)] px-3 py-1.5 rounded-sm border border-[var(--border)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Ventas Totales" value={ordersCount || 1240} icon={DollarSign} prefix="$" />
        <MetricCard title="Productos Activos" value={productsCount || 48} icon={Package} />
        <MetricCard title="Pedidos Pendientes" value={3} icon={ShoppingBag} />
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityChart />
        </div>
      </div>

    </div>
  );
}
