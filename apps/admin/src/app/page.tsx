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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Ventas Totales" value={ordersCount || 0} icon={DollarSign} />
        <StatCard title="Productos Activos" value={productsCount || 0} icon={Package} />
        <StatCard title="Pedidos Pendientes" value="-" icon={ShoppingBag} /> {/* Needs status filter */}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Últimas Ventas</h2>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium truncate max-w-[100px]">{order.id}</td>
                  <td className="px-4 py-3">{order.customer_email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">${order.total_amount}</td>
                  <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay ventas recientes</td>
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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 bg-gray-50 rounded-full">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  )
}
