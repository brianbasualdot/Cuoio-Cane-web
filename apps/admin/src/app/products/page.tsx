import { PageShell } from "@/components/ui/page-shell";
import { Plus, Package, Search, Filter, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
    const supabase = await createClient();
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

    // Empty State Logic could go here if products.length === 0, but shell allows us to show table even if empty or use specific empty state.
    // We'll show the table structure typically.

    return (
        <PageShell
            title="Productos"
            action={
                <Link href="/products/new" className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-hover)] hover:bg-[var(--text-primary)] hover:text-[var(--background)] border border-[var(--border)] rounded-sm text-xs font-medium transition-all duration-300 group">
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                </Link>
            }
        >
            {/* Filters / Search Bar */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] opacity-50" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)/30] focus:outline-none focus:border-[var(--accent-copper)] transition-colors"
                    />
                </div>
                <button className="p-2 border border-[var(--border)] rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors">
                    <Filter className="w-4 h-4" />
                </button>
            </div>

            {/* Table */}
            <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--surface-hover)] border-b border-[var(--border)]">
                        <tr>
                            <th className="px-6 py-4 text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)] font-medium">Nombre</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)] font-medium text-right">Precio</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)] font-medium text-right">Stock</th>
                            <th className="px-6 py-4 text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)] font-medium text-center">Estado</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {products?.map((product: any) => (
                            <tr key={product.id} className="hover:bg-[var(--surface-hover)]/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-sm bg-[var(--background)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-4 h-4 text-[var(--text-secondary)] opacity-30" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-white transition-colors">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                                    ${product.price}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-xs text-[var(--text-secondary)]">
                                    {product.stock_quantity}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider border",
                                        product.status === 'active'
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : "bg-[var(--surface-hover)] text-[var(--text-secondary)] border-[var(--border)]"
                                    )}>
                                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={5} className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <Package className="w-8 h-8 text-[var(--text-secondary)] mb-4" />
                                        <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">Sin productos</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </PageShell>
    );
}

import { cn } from "@/lib/utils";
