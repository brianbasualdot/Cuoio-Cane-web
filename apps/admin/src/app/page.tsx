import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card'; // We'll create a simple Card component inline or generic
import { DollarSign, ShoppingBag, Package, Activity } from 'lucide-react';

export default async function Dashboard() {
  const supabase = await createClient();

  // Metrics Fetching (Parallel)
  const [
    { count: productsCount },
    { count: ordersCount },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  // TODO: Calculate Revenue (needs SQL sum or fetch all - fetch all is bad for scale. Use RPC or just sum last 100 for MVP)
  // For MVP Dashboard, let's just show Counts.

  return (
  return (
    <div className="p-8 md:p-12 space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">Panel de Control</h1>
        <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
          <span>Última act:</span>
          <span className="text-neutral-400">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ventas Totales" value={ordersCount || 0} icon={DollarSign} />
        <StatCard title="Productos Activos" value={productsCount || 0} icon={Package} />
        <StatCard title="Pedidos Pendientes" value="-" icon={ShoppingBag} />
      </div>

      <div className="bg-neutral-900/40 rounded-sm border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-300 tracking-wide">Últimas Ventas</h2>
          <Activity className="w-4 h-4 text-neutral-700" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-950 text-neutral-600 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-normal">ID</th>
                <th className="px-6 py-4 font-normal">Cliente</th>
                <th className="px-6 py-4 font-normal">Estado</th>
                <th className="px-6 py-4 font-normal">Total</th>
                <th className="px-6 py-4 font-normal">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-400">
              {recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors text-xs truncate max-w-[100px]">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-neutral-300">{order.customer_email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {order.status === 'completed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>}
                      {order.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></span>}
                      <span className={`text-xs font-mono uppercase tracking-wider ${order.status === 'completed' ? 'text-emerald-500/80' :
                          order.status === 'pending' ? 'text-amber-500/80' :
                            'text-neutral-600'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-neutral-300">${order.total_amount}</td>
                  <td className="px-6 py-4 text-xs text-neutral-600 font-mono">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-700 font-mono text-xs uppercase tracking-widest">Sin actividad reciente</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-neutral-900/40 p-6 rounded-sm border border-white/5 flex items-start justify-between group hover:border-white/10 transition-colors">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">{title}</p>
        <p className="text-3xl font-mono text-neutral-200 group-hover:text-white transition-colors">{value}</p>
      </div>
      <div className="p-2 bg-white/5 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity">
        <Icon className="w-4 h-4 text-neutral-400" />
      </div>
    </div>
  )
}
