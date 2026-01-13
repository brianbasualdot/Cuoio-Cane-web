'use client';

import { useState } from 'react';
import { useCartStore, CartItem } from '@/lib/store';
import { cn } from '@/lib/utils';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export function ProductDetailClient({ product }: { product: any }) {
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

    const selectedVariant = variants.find((v: any) => v.id === selectedVariantId);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery (Placeholder) */}
            <div className="space-y-4">
                <div className="aspect-[4/5] bg-muted relative rounded-sm overflow-hidden flex items-center justify-center">
                    <span className="font-serif text-6xl text-muted-foreground/20">CC</span>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-serif text-primary mb-2">{product.name}</h1>
                    <p className="text-2xl font-light text-foreground/80">
                        {selectedVariant
                            ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(selectedVariant.price))
                            : variants.length > 0
                                ? `Desde ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Math.min(...variants.map((v: any) => Number(v.price))))}`
                                : 'No disponible'
                        }
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Variantes Disponibles</h3>
                    <div className="flex flex-wrap gap-3">
                        {variants.map((variant: any) => (
                            <button
                                key={variant.id}
                                onClick={() => setSelectedVariantId(variant.id)}
                                className={cn(
                                    "px-4 py-2 border rounded-sm text-sm transition-all",
                                    selectedVariantId === variant.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border hover:border-primary/50 text-foreground"
                                )}
                            >
                                {variant.size} {variant.color && `- ${variant.color}`}
                            </button>
                        ))}
                    </div>
                    {/* Show stock if low? */}
                    {selectedVariant && selectedVariant.stock_quantity < 5 && (
                        <p className="text-xs text-amber-600">
                            ¡Quedan solo {selectedVariant.stock_quantity} unidades!
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Descripción</h3>
                    <div className="prose prose-sm text-foreground/80 leading-relaxed">
                        <p>{product.description}</p>
                    </div>
                </div>

                {product.care_instructions && (
                    <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Cuidados del Cuero</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            {product.care_instructions}
                        </p>
                    </div>
                )}

                <div className="pt-8">
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                        className="w-full h-14 bg-primary text-primary-foreground font-bold tracking-widest hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {selectedVariant && selectedVariant.stock_quantity === 0 ? 'SIN STOCK' : 'AGREGAR AL CARRITO'}
                    </button>
                </div>
            </div>
        </div>
    );
}
