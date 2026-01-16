'use client';

import { MoreHorizontal, Trash2, Edit, Ban, CheckCircle } from 'lucide-react';
import { deleteProduct, toggleProductStatus } from './actions';
import { Button } from '@/components/ui/ActionButton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface ProductRowActionsProps {
    product: any;
}

export function ProductRowActions({ product }: ProductRowActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface border-border-subtle text-zinc-200">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer">
                    <Link href={`/productos/${product.slug}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-subtle" />

                <form action={toggleProductStatus}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="currentStatus" value={String(product.is_active)} />
                    <button className="w-full text-left">
                        <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                            {product.is_active ? (
                                <>
                                    <Ban className="mr-2 h-4 w-4 text-orange-400" />
                                    <span className="text-orange-400">Desactivar</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
                                    <span className="text-emerald-400">Activar</span>
                                </>
                            )}
                        </DropdownMenuItem>
                    </button>
                </form>

                <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button className="w-full text-left">
                        <DropdownMenuItem className="hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10 text-red-400 focus:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
