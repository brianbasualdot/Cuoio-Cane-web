import { createClient } from '@/lib/supabase/server';
import { Truck, CheckCircle } from 'lucide-react';

export default async function ShipmentsPage() {
    const supabase = await createClient();
    const { data: shipments } = await supabase
        .from('orders')
        .select('*')
        .eq('shipping_status', 'pending')
        .neq('payment_status', 'pending') // Only show paid orders ready to ship? Or all.
        .order('created_at', { ascending: true }); // Oldest first

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Envíos Pendientes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shipments?.map((order: any) => (
                    <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-orange-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-mono text-gray-500 mb-1">#{order.id.slice(0, 8)}</p>
                                <h3 className="font-bold text-lg">{order.customer_full_name}</h3>
                                <p className="text-sm text-gray-600">{order.shipping_address?.street} {order.shipping_address?.number}</p>
                                <p className="text-sm text-gray-600">{order.shipping_address?.city}, {order.shipping_address?.province}</p>
                            </div>
                            <Truck className="w-6 h-6 text-orange-500" />
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Método:</span>
                                <span className="font-medium uppercase">{order.shipping_method || 'Standard'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Items:</span>
                                <span className="font-medium">{/* Fetch items count or join? For now just generic */} Ver Detalle</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Marcar Enviado
                            </button>
                        </div>
                    </div>
                ))}

                {(!shipments || shipments.length === 0) && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p>No hay envíos pendientes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
