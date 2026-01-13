import { createClient } from '@/lib/supabase/server';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
// In a real app we'd have a Client Component for the Table to handle search/pagination interactivity.
// For MVP, SSR list is fine.

export default async function ProductsPage() {
    const supabase = await createClient();
    const { data: products } = await supabase.from('products').select('*, variants:product_variants(count)').order('created_at', { ascending: false });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Productos</h1>
                <Link
                    href="/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3">Variantes</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products?.map((product: any) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-500">{product.slug}</td>
                                <td className="px-6 py-4">{product.variants?.[0]?.count || 0}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Link href={`/products/${product.id}/edit`} className="p-1 hover:bg-gray-100 rounded">
                                        <Edit2 className="w-4 h-4 text-gray-500" />
                                    </Link>
                                    {/* Delete button would need client component or server action */}
                                    <button className="p-1 hover:bg-red-50 rounded text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No hay productos registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
