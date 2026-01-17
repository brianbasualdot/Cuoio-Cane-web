'use client';

import { useTransition } from 'react';

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
    const [isPending, startTransition] = useTransition();

    const handleToggleStatus = (e: React.MouseEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await toggleProductStatus(product.id, product.is_active);
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            startTransition(async () => {
                await deleteProduct(product.id);
            });
        }
    };

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

                <DropdownMenuItem
                    className="hover:bg-white/5 cursor-pointer flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none"
                    onClick={handleToggleStatus}
                    disabled={isPending}
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
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10 text-red-400 focus:text-red-400 flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
