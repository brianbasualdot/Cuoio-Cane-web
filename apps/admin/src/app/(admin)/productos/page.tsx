import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-normal text-white">Productos</h2>
                <Button asChild size="sm">
                    <Link href="/productos/nuevo">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Producto
                    </Link>
                </Button>
            </div>

            <div className="border border-border-subtle rounded-token-lg bg-surface">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[300px]">Nombre</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Example Row - In real app, map through data */}
                        <TableRow>
                            <TableCell className="font-medium text-zinc-200">Billetera Compacta - Cuero Italiano</TableCell>
                            <TableCell>BIL-001</TableCell>
                            <TableCell>$45.000</TableCell>
                            <TableCell>12</TableCell>
                            <TableCell>
                                <Badge variant="success">Activo</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium text-zinc-200">Cinturón Clásico - Negro</TableCell>
                            <TableCell>CIN-004</TableCell>
                            <TableCell>$32.000</TableCell>
                            <TableCell>8</TableCell>
                            <TableCell>
                                <Badge variant="success">Activo</Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium text-zinc-200">Bolso de Viaje</TableCell>
                            <TableCell>BOL-012</TableCell>
                            <TableCell>$120.000</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>
                                <Badge variant="destructive">Sin Stock</Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
