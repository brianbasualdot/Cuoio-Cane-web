import { Badge } from '@/components/ui/Badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-normal text-white">Pedidos</h2>
            </div>

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
                        <TableRow>
                            <TableCell className="font-medium text-zinc-200">#ORD-0293</TableCell>
                            <TableCell>Ana García</TableCell>
                            <TableCell>16 Oct 2026</TableCell>
                            <TableCell>$125.000</TableCell>
                            <TableCell>
                                <Badge variant="success">Completado</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium text-zinc-200">#ORD-0294</TableCell>
                            <TableCell>Carlos Mendez</TableCell>
                            <TableCell>16 Oct 2026</TableCell>
                            <TableCell>$45.000</TableCell>
                            <TableCell>
                                <Badge variant="outline">Pendiente</Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
