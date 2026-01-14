'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { hoverScale } from '@/lib/motion';

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
        <motion.div
            variants={hoverScale}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
        >
            <Link href={`/products/${product.slug}`} className="group block h-full">
                <div className="relative aspect-square overflow-hidden bg-surface rounded-sm">
                    {/* Placeholder for Image - in real app would match 'product-images' bucket */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-serif text-4xl">
                        CC
                    </div>

                    {/* <Image 
               src={imageUrl} 
               alt={product.name}
               fill
               className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
            /> */}

                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out">
                        <span className="text-copper text-xs font-medium uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out inline-block">Ver Detalle</span>
                    </div>
                </div>
                <div className="mt-6 flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium text-brand-platinum font-serif tracking-wide">{product.name}</h3>
                        <p className="mt-1 text-sm text-brand-platinum-dark">{product.variants?.length} Variantes</p>
                    </div>
                    <p className="text-sm font-semibold text-copper">
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
