'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/ActionButton';
import { Input } from '@/components/ui/InputField';
import { Card, CardContent } from '@/components/ui/CardContainer';
import { updateProduct } from '../actions';
import { useState, useRef } from 'react';

const initialState = { error: null };

export function EditProductForm({ product }: { product: any }) {
    const [state, formAction] = useFormState(updateProduct, initialState);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Data
    // Assuming single variant for MVP
    const variant = product.variants?.[0] || {};
    const existingImages = product.metadata?.images || [];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newPreviews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviews]);
        }
    };

    return (
        <form action={formAction} className="space-y-6 max-w-4xl mx-auto">
            {/* Hidden IDs */}
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="variantId" value={variant.id || ''} />

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/productos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="font-display text-2xl font-normal text-white">Editar Producto</h2>
                    <p className="text-zinc-500 text-sm">{product.name}</p>
                </div>
            </div>

            {state?.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-md text-sm">
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Nombre del Producto</label>
                                <Input
                                    name="name"
                                    required
                                    placeholder="Ej: Billetera de Cuero"
                                    defaultValue={product.name}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Descripción</label>
                                <textarea
                                    name="description"
                                    className="flex min-h-[120px] w-full rounded-token-md border border-border-base bg-surface px-3 py-2 text-sm shadow-sm placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coffee text-zinc-200"
                                    placeholder="Descripción detallada del producto..."
                                    defaultValue={product.description}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-medium text-white mb-4">Inventario y Precios</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Precio</label>
                                    <Input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        defaultValue={variant.price}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Stock Actual</label>
                                    <Input
                                        name="stock"
                                        type="number"
                                        required
                                        placeholder="0"
                                        defaultValue={variant.stock_quantity}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">SKU</label>
                                    <Input
                                        name="sku"
                                        required
                                        placeholder="ABC-123"
                                        defaultValue={variant.sku}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-medium text-white mb-4">Imágenes</h3>

                            {/* Existing Images Display */}
                            {existingImages.length > 0 && (
                                <div className="mb-6 space-y-2">
                                    <label className="text-xs text-zinc-500">Imágenes Actuales</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {existingImages.map((src: string, i: number) => (
                                            <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-zinc-900 border border-border-subtle">
                                                <img src={src} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-border-subtle rounded-token-md p-8 text-center hover:bg-surface-hover/30 transition-colors cursor-pointer group relative overflow-hidden"
                            >
                                <input
                                    ref={fileInputRef}
                                    name="images"
                                    type="file"
                                    multiple
                                    accept="image/png, image/jpeg, image/webp"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                {previewImages.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {previewImages.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-zinc-900">
                                                <img src={src} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-center mb-3">
                                            <div className="p-3 bg-surface rounded-full border border-border-subtle group-hover:border-coffee/50 transition-colors">
                                                <Upload className="h-5 w-5 text-zinc-400 group-hover:text-coffee transition-colors" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-400 font-medium">Agregar más fotos</p>
                                        <p className="text-xs text-zinc-600 mt-1">Soporta JPG, PNG (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full" size="lg">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </form>
    );
}
