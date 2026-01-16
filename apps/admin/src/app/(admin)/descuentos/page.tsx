import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/ActionButton';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DiscountRow } from './DiscountRow';

export default async function DiscountsPage() {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Role Check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const isAdmin = profile?.role === 'admin';

    // Fetch Discounts
    const { data: discounts } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display text-2xl font-normal text-white">Descuentos</h2>
                    <p className="text-zinc-400 text-sm font-light mt-1">Gestión de cupones y promociones</p>
                </div>
                {isAdmin && (
                    <Button asChild size="sm">
                        <Link href="/descuentos/nuevo">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Cupón
                        </Link>
                    </Button>
                )}
            </div>

            <div className="border border-border-subtle rounded-token-lg bg-surface">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border-subtle">
                            <TableHead>Código</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Aplica a</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Usos</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!discounts || discounts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-zinc-500">
                                    No hay descuentos creados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            discounts.map((discount) => (
                                <DiscountRow key={discount.id} discount={discount} isAdmin={isAdmin} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
