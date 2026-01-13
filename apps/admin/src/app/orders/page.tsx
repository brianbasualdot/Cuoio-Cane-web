import { createClient } from '@/lib/supabase/server';
import { Eye, Truck } from 'lucide-react';
import Link from 'next/link';

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Ventas</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Orden #</th>
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Pago</th>
                            <th className="px-6 py-3">Envío</th>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders?.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{order.customer_full_name}</div>
                                    <div className="text-gray-500 text-xs">{order.customer_email}</div>
                                </td>
                                <td className="px-6 py-4 font-medium">${order.total_amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment_status === 'approved' ? 'bg-green-100 text-green-800' :
                                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {order.payment_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.shipping_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            order.shipping_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.shipping_status || 'pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Link href={`/orders/${order.id}`} className="p-1 hover:bg-gray-100 rounded text-gray-600">
                                        <Eye className="w-5 h-5" />
                                    </Link>
                                    {order.shipping_status === 'pending' && (
                                        <Link href={`/orders/${order.id}/ship`} className="p-1 hover:bg-blue-50 rounded text-blue-600">
                                            <Truck className="w-5 h-5" />
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
