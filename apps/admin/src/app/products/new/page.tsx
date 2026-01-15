'use client';

import { PageShell } from "@/components/ui/page-shell";
import { Upload, X, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AddProductPage() {
    const [images, setImages] = useState<string[]>([]);
    const [dragging, setDragging] = useState(false);

    // Mock Upload Logic
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        // In a real app, we would process e.dataTransfer.files
        // For visual demo, we assume success
        alert("In a real implementation, this would upload files to Supabase Storage.");
    };

    return (
        <PageShell
            title="Nuevo Producto"
            action={
                <Link href="/products" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver/Cancelar</span>
                </Link>
            }
            className="max-w-[1600px] mx-auto"
        >
            <form className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Images */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Image Upload Area */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]">Galería de Imágenes</label>

                        <div
                            className={`
                  relative h-[400px] border border-dashed rounded-sm flex flex-col items-center justify-center transition-all duration-300
                  ${dragging ? 'border-[var(--accent-copper)] bg-[var(--accent-copper)]/5' : 'border-[var(--border)] bg-[var(--surface)]'}
                `}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                        >
                            <div className="p-4 rounded-full bg-[var(--background)] mb-6 border border-[var(--border)]">
                                <Upload className="w-6 h-6 text-[var(--text-secondary)]" />
                            </div>
                            <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Arrastra tus imágenes aquí</p>
                            <p className="text-xs text-[var(--text-secondary)] opacity-60">Soporta JPG, PNG hasta 5MB</p>

                            {/* Click trigger (hidden input would be here) */}
                            <button type="button" className="mt-6 px-6 py-2 border border-[var(--border)] rounded-sm text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">
                                Explorar archivos
                            </button>
                        </div>

                        {/* Preview List (Empty state or filled) */}
                        <div className="grid grid-cols-4 gap-4">
                            {/* Placeholder slots if empty */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-[var(--surface)] border border-[var(--border)] rounded-sm flex items-center justify-center opacity-30">
                                    <ImageIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]">Descripción</label>
                        <textarea
                            className="w-full h-[200px] p-4 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)/30] focus:outline-none focus:border-[var(--accent-copper)] transition-colors resize-none leading-relaxed"
                            placeholder="Describe el producto con detalle, materiales y proceso..."
                        />
                    </div>
                </div>

                {/* Right Column: Meta Info */}
                <div className="space-y-8">

                    <div className="p-8 bg-[var(--surface)] border border-[var(--border)] rounded-sm space-y-6 sticky top-6">
                        <h3 className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-wide border-b border-[var(--border)] pb-4">Información Base</h3>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]">Nombre</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-copper)] transition-colors"
                                placeholder="Ej. Billetera Cuoio Classic"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]">Precio (ARS)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-copper)] transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]">Stock</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-copper)] transition-colors"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[var(--border)]">
                            <button className="w-full py-4 bg-[var(--text-primary)] text-[var(--background)] font-medium text-xs uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" />
                                Guardar Producto
                            </button>
                        </div>
                    </div>

                </div>

            </form>
        </PageShell>
    );
}
