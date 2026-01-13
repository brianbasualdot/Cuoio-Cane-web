import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    slug: string;
    name: string;
    price?: number; // Logic: show lowest variant price?
    variants?: any[];
}

export function ProductCard({ product }: { product: Product }) {
    // Simple logic to find price from variants
    const price = product.variants && product.variants.length > 0
        ? Math.min(...product.variants.map((v: any) => Number(v.price)))
        : 0;

    return (
        <Link href={`/products/${product.slug}`} className="group block h-full">
            <div className="relative aspect-square overflow-hidden bg-muted rounded-sm">
                {/* Placeholder for Image - in real app would match 'product-images' bucket */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-serif text-4xl">
                    CC
                </div>
                {/* <Image 
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
         /> */}

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                    <span className="text-brand-platinum text-xs font-medium uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-700">Ver Detalle</span>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-start">
                <div>
                    <h3 className="text-base font-medium text-primary group-hover:text-primary/80 transition-colors font-serif">{product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{product.variants?.length} Variantes</p>
                </div>
                <p className="text-sm font-semibold text-primary">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)}
                </p>
            </div>
        </Link>
    );
}
