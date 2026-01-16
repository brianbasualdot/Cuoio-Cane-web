import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { PackageOpen } from 'lucide-react';

async function getProducts() {
    try {
        const products = await api.get('/products');
        if (!products || !Array.isArray(products)) {
            return [];
        }
        return products;
    } catch (e) {
        console.error('Failed to fetch products', e);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();
    const hasProducts = products && products.length > 0;

    return (
        <div className="min-h-screen bg-black text-brand-platinum pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight">Colección</h1>
                    <p className="text-muted-foreground max-w-xl text-sm md:text-base tracking-wide">
                        Objetos diseñados para la permanencia. Cuero genuino y construcción honesta.
                    </p>
                </div>

                {!hasProducts ? (
                    <div className="flex flex-col items-center justify-center py-32 md:py-48 text-center space-y-6 border border-white/5 rounded-lg bg-neutral-900/10">
                        <div className="p-4 rounded-full bg-white/5">
                            <PackageOpen className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground/50" strokeWidth={1} />
                        </div>
                        <p className="font-serif text-xl md:text-2xl text-muted-foreground/60 uppercase tracking-[0.2em]">
                            UPS! NO HAY NADA PARA MOSTRAR AQUI
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {products.map((product: any) => (
                            <div key={product.id} className="group">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
