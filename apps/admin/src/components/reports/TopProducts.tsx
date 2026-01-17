import { Card } from '@/components/ui/CardContainer'; // Assuming exists or I will just use div with classes if not found, but used in page.tsx
import { Package } from 'lucide-react';

interface ProductStat {
    name: string;
    quantity: number;
    revenue: number;
}

export function TopProducts({ products }: { products: ProductStat[] }) {
    return (
        <Card className="p-6 border-border-subtle bg-surface h-full">
            <h3 className="text-white font-display text-lg mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-zinc-500" />
                Top Productos
            </h3>
            <div className="space-y-4">
                {products.length === 0 ? (
                    <p className="text-zinc-500 text-sm">No hay datos disponibles.</p>
                ) : (
                    products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-zinc-600 w-4">{index + 1}</span>
                                <span className="text-sm text-zinc-300 font-medium truncate max-w-[180px] group-hover:text-white transition-colors">
                                    {product.name}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-white">{product.quantity} un.</div>
                                <div className="text-xs text-zinc-500">
                                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(product.revenue)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
