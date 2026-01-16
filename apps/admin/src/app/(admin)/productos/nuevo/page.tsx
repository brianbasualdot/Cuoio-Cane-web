'use client';

import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/InputField';
import { Card, CardContent } from '@/components/ui/CardContainer';

export default function NewProductPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/productos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="font-display text-2xl font-normal text-white">Nuevo Producto</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Nombre del Producto</label>
                                <Input placeholder="Ej: Billetera de Cuero" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Descripción</label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-token-md border border-border-base bg-surface px-3 py-2 text-sm shadow-sm placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coffee text-zinc-200"
                                    placeholder="Descripción detallada del producto..."
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
                                    <Input type="number" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Stock Inicial</label>
                                    <Input type="number" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">SKU</label>
                                    <Input placeholder="ABC-123" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-medium text-white mb-4">Imágenes</h3>
                            <div
                                onClick={() => document.getElementById('image-upload')?.click()}
                                className="border-2 border-dashed border-border-subtle rounded-token-md p-8 text-center hover:bg-surface-hover/30 transition-colors cursor-pointer group"
                            >
                                <input
                                    id="image-upload"
                                    type="file"
                                    multiple
                                    accept="image/png, image/jpeg, image/webp"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const count = e.target.files.length;
                                            alert(`Seleccionaste ${count} imagen(es). La subida real se conectará en la próxima etapa.`);
                                        }
                                    }}
                                />
                                <div className="flex justify-center mb-3">
                                    <div className="p-3 bg-surface rounded-full border border-border-subtle group-hover:border-coffee/50 transition-colors">
                                        <Upload className="h-5 w-5 text-zinc-400 group-hover:text-coffee transition-colors" />
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-400 font-medium">Click para subir múltiples fotos</p>
                                <p className="text-xs text-zinc-600 mt-1">Soporta JPG, PNG (Max 5MB)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full" size="lg">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Producto
                    </Button>
                </div>
            </div>
        </div>
    );
}
