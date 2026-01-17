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
                <DropdownMenuItem asChild>
                    <Link
                        href={`/productos/${product.slug}`}
                        className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white/5 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border-subtle" />

                <form action={toggleProductStatus}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="currentStatus" value={String(product.is_active)} />
                    <DropdownMenuItem asChild>
                        <button
                            type="submit"
                            className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white/5 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
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
                        </button>
                    </DropdownMenuItem>
                </form>

                <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <DropdownMenuItem asChild>
                        <button
                            type="submit"
                            className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-400 focus:text-red-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-400"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
