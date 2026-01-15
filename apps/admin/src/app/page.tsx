import { createClient } from '@/lib/supabase/server';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { Header } from '@/components/layout/header';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { MetricsGrid } from '@/components/dashboard/metrics-grid';

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
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Resumen General" />

      <div className="p-8 space-y-8 flex-1 overflow-y-auto">

        {/* Metrics Grid */}
        <MetricsGrid
          productsCount={productsCount || 0}
          ordersCount={ordersCount || 0}
        />

        {/* Charts Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="lg:col-span-1">
            <RecentOrders />
          </div>
        </div>

      </div>
    </div>
  );
}
