import { createClient } from '@/lib/supabase/server';
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

  return (
    <div className="p-8 md:p-12 space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)]">Panel de Control</h1>
        <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] font-mono opacity-50">
          <span>Última act:</span>
          <span className="text-[var(--text-primary)]">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ventas Totales" value={ordersCount || 0} icon={DollarSign} />
        <StatCard title="Productos Activos" value={productsCount || 0} icon={Package} />
        <StatCard title="Pedidos Pendientes" value="-" icon={ShoppingBag} />
      </div>

      <div className="rounded-sm border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-xs font-medium text-[var(--text-primary)] tracking-wide uppercase font-mono">Últimas Ventas</h2>
          <Activity className="w-4 h-4 text-[var(--text-secondary)] opacity-50" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--surface-hover)] text-[var(--text-secondary)] font-mono text-[9px] uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-normal opacity-70">ID</th>
                <th className="px-8 py-4 font-normal opacity-70">Cliente</th>
                <th className="px-8 py-4 font-normal opacity-70">Estado</th>
                <th className="px-8 py-4 font-normal opacity-70">Total</th>
                <th className="px-8 py-4 font-normal opacity-70">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--text-primary)]">
              {recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-[var(--surface-hover)] transition-colors duration-200 group">
                  <td className="px-8 py-5 font-mono text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors text-xs truncate max-w-[100px] opacity-70">{order.id.slice(0, 8)}...</td>
                  <td className="px-8 py-5 text-[var(--text-primary)] text-xs font-medium tracking-wide">{order.customer_email}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {order.status === 'completed' && <span className="w-1 h-1 rounded-full bg-emerald-500/50"></span>}
                      {order.status === 'pending' && <span className="w-1 h-1 rounded-full bg-amber-500/50"></span>}
                      <span className={`text-[9px] font-mono uppercase tracking-widest ${order.status === 'completed' ? 'text-emerald-500/70' :
                        order.status === 'pending' ? 'text-amber-500/70' :
                          'text-[var(--text-secondary)]'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-mono text-[var(--text-primary)] text-xs">${order.total_amount}</td>
                  <td className="px-8 py-5 text-[10px] text-[var(--text-secondary)] font-mono opacity-50">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-widest opacity-40">Sin actividad reciente</td>
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
    <div className="bg-[var(--surface)] p-8 rounded-sm border border-[var(--border)] flex items-start justify-between group hover:border-[var(--text-secondary)] transition-colors duration-500">
      <div>
        <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4 opacity-70">{title}</p>
        <p className="text-4xl font-light text-[var(--text-primary)] tracking-tight">{value}</p>
      </div>
      <div className="p-3 bg-[var(--surface-hover)] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
        <Icon className="w-4 h-4 text-[var(--accent-copper)]" />
      </div>
    </div>
  )
}
