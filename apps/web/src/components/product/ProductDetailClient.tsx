'use client';

import { useState } from 'react';
import { useCartStore, CartItem } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ShoppingBag, ChevronRight } from 'lucide-react';


interface Variant {
    id: string;
    sku: string;
    size: string;
    color?: string;
    price: number;
    stock_quantity: number;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    variants: Variant[];
    care_instructions?: string;
}

export function ProductDetailClient({ product }: { product: Product }) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    // Derive unique colors and sizes from variants
    // This logic depends on how robust the variants are. 
    // For MVP, simplistic selection: Just show list of variants or try to group.
    // Grouping by size/color is complex if combinations vary. 
    // Let's assume user picks a specific variant from a list if simplistic, 
    // OR we implement simple Size Selector if Color is unique per product page?
    // User Prompt said: "Collar Classic - Red - M".

    // Let's try to infer available sizes.
    // Check if variants exist.
    const variants = product.variants || [];

    // Basic Selection Logic: Select Variant directly or filter?
    // Let's do a simple Selector:

    const selectedVariant = variants.find((v) => v.id === selectedVariantId);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addItem({
            variantId: selectedVariant.id,
            sku: selectedVariant.sku,
            name: product.name,
            variantName: `${selectedVariant.color || ''} ${selectedVariant.size || ''}`.trim(),
            price: Number(selectedVariant.price),
            quantity: quantity,
            image: undefined // Add image logic later
        });

        alert('Agregado al carrito'); // Replace with toast later
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* 1. GALERÍA - Dominante, Observar un objeto real */}
            <div className="space-y-8 sticky top-24">
                {/* Main Image - Large, breathing */}
                <div className="aspect-[3/4] bg-neutral-900/10 relative rounded-sm overflow-hidden flex items-center justify-center border border-white/5">
                    {/* Placeholder for now as per original code, or product image */}
                    {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700" />
                    ) : (
                        <span className="font-serif text-8xl text-white/5 select-none">CC</span>
                    )}
                </div>
            </div>

            {/* 2. INFORMACIÓN - Texto claro, pocos elementos */}
            <div className="flex flex-col space-y-12 py-8">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-brand-platinum leading-none">
                        {product.name}
                    </h1>
                    <p className="text-2xl font-light text-brand-platinum/60">
                        {selectedVariant
                            ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(selectedVariant.price))
                            : variants.length > 0
                                ? `Desde ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Math.min(...variants.map((v) => Number(v.price))))}`
                                : 'Consultar'
                        }
                    </p>
                </div>

                {/* Description - Brief, elegant */}
                <div className="prose prose-p:text-muted-foreground/80 prose-p:font-light prose-p:leading-loose text-sm max-w-sm">
                    <p>{product.description}</p>
                </div>

                {/* Variants - Clean hierarchy */}
                {variants.length > 0 && (
                    <div className="space-y-6">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/40 font-medium">Variante</span>
                        <div className="flex flex-wrap gap-4">
                            {variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariantId(variant.id)}
                                    className={cn(
                                        "px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 border",
                                        selectedVariantId === variant.id
                                            ? "border-brand-platinum text-brand-platinum bg-white/5"
                                            : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-brand-platinum/80"
                                    )}
                                >
                                    {variant.size} {variant.color && `— ${variant.color}`}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Material / Care - Technical, honest */}
                {product.care_instructions && (
                    <div className="space-y-4 pt-8 border-t border-white/5">
                        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground/40">Cuidado</h3>
                        <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-sm font-light">
                            {product.care_instructions}
                        </p>
                    </div>
                )}

                {/* 3. BLOQUE PAGAR - Sin gritar */}
                <div className="space-y-6 pt-8">
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                        className="w-full h-16 border border-white/20 hover:border-brand-platinum text-brand-platinum hover:bg-white/5 disabled:opacity-30 disabled:hover:border-white/10 transition-all duration-500 uppercase tracking-[0.2em] text-sm font-medium flex items-center justify-center gap-4"
                    >
                        {/* Minimal Icon */}
                        {selectedVariant && selectedVariant.stock_quantity === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </button>

                    <div className="flex items-center justify-center gap-2 opacity-40">
                        {/* Very subtle reassurance */}
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Pago Seguro . Envíos a todo el país</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
