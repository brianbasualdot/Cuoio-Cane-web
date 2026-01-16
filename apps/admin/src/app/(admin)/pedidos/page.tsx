import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/StatusBadge';
import { PackageOpen } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/DataTable';

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    const hasOrders = orders && orders.length > 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-normal text-white">Pedidos</h2>
            </div>

            {!hasOrders ? (
                <div className="flex flex-col items-center justify-center py-24 border border-border-subtle rounded-token-lg bg-surface/50 border-dashed">
                    <PackageOpen className="h-12 w-12 text-zinc-600 mb-4" strokeWidth={1} />
                    <p className="text-zinc-500 font-display text-lg">No hay nada por aqui..</p>
                    <p className="text-zinc-700 text-sm mt-1">Aún no se han registrado pedidos</p>
                </div>
            ) : (
                <div className="border border-border-subtle rounded-token-lg bg-surface">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>ID Pedido</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-zinc-200">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>{order.customer_full_name}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(order.total_amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'completed' ? 'success' : 'outline'}>
                                            {order.status === 'pending' ? 'Pendiente' :
                                                order.status === 'completed' ? 'Completado' : order.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
