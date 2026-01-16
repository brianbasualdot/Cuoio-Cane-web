import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { redirect } from 'next/navigation';

export default async function MetricsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/'); // Or /unauthorized
    }

    // Fetch events
    const { data: events, error } = await supabase
        .from('order_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Pagination in v2

    if (error) {
        console.error('Error fetching events:', error);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl font-normal text-white">Bitácora Operativa</h2>
                <p className="text-zinc-400 max-w-2xl font-light text-sm">
                    Registro detallado de acciones realizadas sobre pedidos por el equipo.
                </p>
            </div>

            <Card className="border-border-subtle bg-surface">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Fecha</TableHead>
                                <TableHead>Acción</TableHead>
                                <TableHead>Pedido Ref.</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Usuario / Alias</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!events || events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                        No hay eventos registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-mono text-xs text-zinc-400">
                                            {new Date(event.created_at).toLocaleString('es-AR')}
                                        </TableCell>
                                        <TableCell className="font-medium text-zinc-200">
                                            {event.action}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {event.order_id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={event.actor_role === 'admin' ? 'outline' : 'secondary'}>
                                                {event.actor_role.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            {event.actor_role === 'staff' && event.actor_alias ? (
                                                <span className="text-emerald-400 font-medium">{event.actor_alias}</span>
                                            ) : (
                                                <span className="opacity-70">Admin</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
