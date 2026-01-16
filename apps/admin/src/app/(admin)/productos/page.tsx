import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/ActionButton';
import { Badge } from '@/components/ui/StatusBadge';
import { ProductRowActions } from './ProductRowActions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/DataTable';

export default async function ProductsPage() {
    const supabase = await createClient();
    const { data: products } = await supabase
        .from('products')
        .select('*, variants:product_variants(*)')
        .order('created_at', { ascending: false });

    const hasProducts = products && products.length > 0;

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

            {!hasProducts ? (
                <div className="flex flex-col items-center justify-center py-24 border border-border-subtle rounded-token-lg bg-surface/50 border-dashed">
                    <PackageOpen className="h-12 w-12 text-zinc-600 mb-4" strokeWidth={1} />
                    <p className="text-zinc-500 font-display text-lg">No hay nada por aqui..</p>
                    <p className="text-zinc-700 text-sm mt-1">Comienza agregando tu primer producto</p>
                </div>
            ) : (
                <div className="border border-border-subtle rounded-token-lg bg-surface">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px]">Nombre</TableHead>
                                <TableHead>SKU (Variantes)</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Stock Total</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => {
                                // Simple aggregation for MVP display
                                const stockTotal = product.variants?.reduce((acc: number, v: any) => acc + v.stock_quantity, 0) || 0;
                                const price = product.variants?.[0]?.price || 0;
                                const skus = product.variants?.map((v: any) => v.sku).join(', ') || '-';

                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium text-zinc-200">{product.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{skus}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)}</TableCell>
                                        <TableCell>{stockTotal}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.is_active && stockTotal > 0 ? "success" : "destructive"}>
                                                {product.is_active ? (stockTotal > 0 ? 'Activo' : 'Sin Stock') : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <ProductRowActions product={product} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
