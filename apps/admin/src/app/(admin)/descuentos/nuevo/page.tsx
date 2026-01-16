'use client';

import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/InputField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useActionState } from 'react';
import { createDiscount } from '../actions';

function SubmitButton() {
    return (
        <Button className="w-full" size="lg" type="submit">
            <Save className="mr-2 h-4 w-4" />
            Guardar Cupón
        </Button>
    );
}

export default function NewDiscountPage() {
    const [state, formAction] = useActionState(createDiscount, null);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/descuentos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="font-display text-2xl font-normal text-white">Nuevo Descuento</h2>
            </div>

            <form action={formAction} className="space-y-6">

                {/* Identity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-zinc-300">Identidad</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Código del Cupón</label>
                            <Input name="code" placeholder="Ej: VERANO2026" required className="uppercase font-mono tracking-wider" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Descripción (Opcional)</label>
                            <Input name="description" placeholder="Descuento por temporada estival" />
                        </div>
                    </CardContent>
                </Card>

                {/* Rules & Value */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-zinc-300">Reglas y Valor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Tipo de Descuento</label>
                                <select
                                    name="type"
                                    className="flex h-10 w-full rounded-token-md border border-border-base bg-surface px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coffee"
                                >
                                    <option value="percentage">Porcentaje (%)</option>
                                    <option value="fixed">Monto Fijo (ARS)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Valor</label>
                                <Input name="value" type="number" step="0.01" min="0" placeholder="10" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Aplica a</label>
                                <select
                                    name="applies_to"
                                    className="flex h-10 w-full rounded-token-md border border-border-base bg-surface px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-coffee"
                                >
                                    <option value="order">Toda la Orden</option>
                                    {/* Product selection logic would go here in V2 using product_ids */}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Mínimo de Compra (ARS)</label>
                                <Input name="min_purchase" type="number" min="0" placeholder="0" defaultValue="0" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Limits */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-zinc-300">Límites y Fechas</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Límite de Usos (Total)</label>
                            <Input name="usage_limit" type="number" min="1" placeholder="Ilimitado" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Fecha de Expiración</label>
                            <Input name="expires_at" type="datetime-local" className="dark:[color-scheme:dark]" />
                        </div>
                    </CardContent>
                </Card>

                {state?.error && (
                    <div className="flex items-center gap-2 p-3 text-xs text-red-200 bg-red-900/40 border border-red-900/50 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        <span>{state.error}</span>
                    </div>
                )}

                <SubmitButton />
            </form>
        </div>
    );
}
