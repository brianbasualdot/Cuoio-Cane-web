import { createClient } from '@/lib/supabase/server';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { PageShell } from '@/components/ui/page-shell';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';

// DASHBOARD PAGE (The Assembly)
// Explicit Layout: Grid Strategy

export default async function Dashboard() {
  const supabase = await createClient();

  // Metrics Fetching
  const [
    { count: productsCount },
    { count: ordersCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <PageShell
      title="Panel de Control"
      subtitle="Resumen de Actividad"
      className="space-y-8" // Explicit vertical spacing
    >

      {/* SECTION 1: KEY METRICS */}
      <section>
        <MetricsGrid
          productsCount={productsCount || 0}
          ordersCount={ordersCount || 0}
        />
      </section>

      {/* SECTION 2: CHARTS & DATA */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">

        {/* Main Chart: Takes 2/3 width */}
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Rendimiento de Ventas
            </h3>
            {/* Optional Action / Filter */}
          </div>
          <div className="flex-1 w-full min-h-0">
            <SalesChart />
          </div>
        </div>

        {/* Secondary Data: Recent Orders (1/3 width) */}
        <div className="lg:col-span-1 h-full min-h-0">
          <RecentOrders />
        </div>

      </section>

    </PageShell>
  );
}
