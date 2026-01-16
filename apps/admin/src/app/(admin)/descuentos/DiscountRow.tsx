'use client';

import { TableCell, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2, RefreshCw } from 'lucide-react';
import { toggleDiscountStatus, deleteDiscount } from './actions';
import { useTransition } from 'react';

interface DiscountRowProps {
    discount: any;
    isAdmin: boolean;
}

export function DiscountRow({ discount, isAdmin }: DiscountRowProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        if (!isAdmin) return;
        startTransition(async () => {
            await toggleDiscountStatus(discount.id, discount.active);
        });
    };

    const handleDelete = () => {
        if (!isAdmin) return;
        if (!confirm('¿Estás seguro de eliminar este cupón?')) return;
        startTransition(async () => {
            await deleteDiscount(discount.id);
        });
    };

    return (
        <TableRow key={discount.id} className="hover:bg-transparent">
            <TableCell className="font-mono text-white font-medium">
                {discount.code}
            </TableCell>
            <TableCell className="text-zinc-300">
                {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
            </TableCell>
            <TableCell className="text-xs text-zinc-400">
                {discount.applies_to === 'order' ? 'Total Compra' : 'Productos'}
            </TableCell>
            <TableCell>
                <Badge variant={discount.active ? 'success' : 'secondary'}>
                    {discount.active ? 'Activo' : 'Inactivo'}
                </Badge>
            </TableCell>
            <TableCell className="text-zinc-400 text-xs">
                {discount.used_count} / {discount.usage_limit ?? '∞'}
            </TableCell>
            <TableCell>
                {isAdmin && (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggle}
                            disabled={isPending}
                            title={discount.active ? "Desactivar" : "Activar"}
                        >
                            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </TableCell>
        </TableRow>
    );
}
