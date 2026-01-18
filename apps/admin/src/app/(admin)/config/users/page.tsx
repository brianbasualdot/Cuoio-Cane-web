'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/CardContainer';
import { Plus, Trash2, Loader2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/ActionButton';
import { cn } from '@/lib/utils'; // Assuming utils location
import { useOfflineMutation } from '@/hooks/useOfflineMutation';
import { useStaffAlias } from '@/contexts/StaffAliasContext';

interface StaffMember {
    id: string;
    alias: string;
    operative_code: string;
    is_active: boolean;
}

export default function StaffPage() {
    const [showModal, setShowModal] = useState(false);

    // Modal State
    const [formAlias, setFormAlias] = useState('');
    const [formCode, setFormCode] = useState('');
    const [message, setMessage] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

    // React Query for caching and offline support
    const { data: staff = [], isLoading: loading, refetch } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            // Standard fetch is fine here because useQuery handles the promise
            // If offline, fetch throws, and if we have cache, it returns cache.
            const res = await fetch(`${apiUrl}/staff`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json() as Promise<StaffMember[]>;
        },
        // We rely on global defaultOptions usually, but can override here
    });

    useEffect(() => {
        // Optional: listen to online event to refetch automatically?
        // React Query does this by default with 'refetchOnReconnect'.
    }, []);

    // Context
    const { alias: currentAlias } = useStaffAlias();
    // Fallback ID if alias is null (e.g. Admin acting as system)
    // The requirement says "operario_id". For Admin, we might use "ADMIN" or user UUID.
    // For now, we use a placeholder or the alias itself if available.
    const operarioId = currentAlias || 'SYSTEM_ADMIN';

    // Mutations
    // Actually we don't have queryClient in scope, need to get it via useQueryClient hook
    // But we are inside the component, so:
    const client = useQueryClient();

    const { mutate: createStaff, isLoading: isCreatingMutation } = useOfflineMutation({
        entidad: 'staff',
        accion: 'create',
        onSuccess: (res: any) => {
            setShowModal(false);
            // Simple safe ID for optimistic update
            const tempId = 'opt_' + Date.now() + Math.random().toString(36).slice(2);
            const newStaff = { id: tempId, alias: formAlias, operative_code: formCode, is_active: true }; // Optimistic ID

            // Optimistic Update
            client.setQueryData(['staff'], (old: StaffMember[] | undefined) => {
                return old ? [...old, newStaff] : [newStaff];
            });

            setFormAlias('');
            setFormCode('');
            setMessage('');

            refetch(); // Fetch real data to confirm ID
        },
        onError: (err) => setMessage(err instanceof Error ? err.message : 'Error creating staff')
    });

    const { mutate: updateStatus } = useOfflineMutation({
        entidad: 'staff',
        accion: 'update',
        onSuccess: () => {
            // We can't easily optimistic update here because 'updateStatus' handler has the variables (id, status)
            // but onSuccess doesn't receive them back unless we pass them through or closure.
            // Refetch is fine for status if sync is fast, but for offline strictness we should closure it.
            // However, let's rely on refetch for simplicity unless user complaints about toggle lag specifically.
            // Actually user DID complain: "lo mismo si habilito o deshabilito".
            refetch();
        }
    });

    const { mutate: deleteStaff } = useOfflineMutation({
        entidad: 'staff',
        accion: 'delete',
        onSuccess: () => refetch()
    });

    // We need to wrap handlers to perform optimistic updates manually if we want perfection, 
    // OR we change useOfflineMutation to allow onMutate?
    // "useOfflineMutation" implementation is simple.
    // Let's just do manual optimistic update INSIDE the handler before calling mutate? 
    // No, mutate is async.

    // BETTER APPROACH: Pass custom onSuccess closures to mutate calls in handlers?
    // No, hook is defined with static callbacks.

    // Let's redefine the mutations below to be dynamic or fix the lag via 'await sync' first.
    // Verification: The user said "one step behind". The `await sync` fixes the Online step behind.
    // For Offline step behind (optimistic), we DO need setQueryData.

    // Let's leave Create optimistic as above.
    // For Toggle/Delete, we will implement optimistic updates in the Next Step if 'await sync' isn't enough for Online,
    // BUT for Offline support we MUST do it.

    // Updating 'updateStatus' and 'deleteStaff' to use queryClient is tricky without passing args to onSuccess.
    // Refactoring to just define the hook once and use `params` in mutate is how it works.
    // But `onSuccess` is defined at hook level in my current implementation.

    // QUICK FIX: Since I can't easily access the `id` inside `onSuccess` defined here without changing the hook architecture,
    // I will modify `toggleStatus` and `handleDelete` to manually update cache BEFORE or AFTER calling mutate,
    // assuming success (Optimistic).
    // Actually, `mutate` is void/async.

    // Let's revert to `await sync` fix first for `create`, and see if that satisfies the "online" flow.
    // For "offline", the `create` optimistic update above helps. 
    // For `toggle`, I will do manual cache update in the handler function.

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        // Payload matches what the API expects for creation
        createStaff({ alias: formAlias, code: formCode }, operarioId);
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic Update
        client.setQueryData(['staff'], (old: StaffMember[] | undefined) => {
            if (!old) return [];
            return old.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s);
        });

        updateStatus({ id, isActive: !currentStatus }, operarioId);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this staff member? This cannot be undone.')) return;

        // Optimistic Delete
        client.setQueryData(['staff'], (old: StaffMember[] | undefined) => {
            if (!old) return [];
            return old.filter(s => s.id !== id);
        });

        deleteStaff({ id }, operarioId);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-display text-2xl font-normal text-white">Staff Management</h2>
                    <p className="text-zinc-400 font-light text-sm">Manage operative users (alias + code).</p>
                </div>
                <Button onClick={() => setShowModal(true)} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> New Staff
                </Button>
            </div>

            <Card className="border-border-subtle bg-surface">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-400">
                            <thead className="bg-surface-hover/50 text-zinc-200 uppercase text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-4">Alias</th>
                                    <th className="px-6 py-4">Operative Code</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-500" />
                                        </td>
                                    </tr>
                                ) : staff.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No staff members found.</td>
                                    </tr>
                                ) : (
                                    staff.map((s) => (
                                        <tr key={s.id} className="hover:bg-surface-hover/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{s.alias}</td>
                                            <td className="px-6 py-4 font-mono">{s.operative_code}</td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                    s.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                                )}>
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", s.is_active ? "bg-emerald-500" : "bg-red-500")} />
                                                    {s.is_active ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(s.id, s.is_active)}
                                                    className="p-2 text-zinc-400 hover:text-white hover:bg-surface-hover rounded-md transition-all"
                                                    title={s.is_active ? "Disable" : "Enable"}
                                                >
                                                    {s.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(s.id)}
                                                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-sm bg-surface border-border-subtle shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <CardHeader>
                            <CardTitle>Create Staff</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Alias (Short Name)</label>
                                    <input
                                        type="text"
                                        value={formAlias}
                                        onChange={(e) => setFormAlias(e.target.value.toUpperCase())}
                                        maxLength={10}
                                        className="w-full bg-surface-hover border border-border-subtle rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-500 uppercase"
                                        placeholder="JUAN"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400">Operative Code (2 digits)</label>
                                    <input
                                        type="text"
                                        value={formCode}
                                        onChange={(e) => setFormCode(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                        className="w-full bg-surface-hover border border-border-subtle rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-500 font-mono tracking-widest text-center"
                                        placeholder="00"
                                        pattern="\d{2}"
                                        required
                                    />
                                </div>

                                {message && <p className="text-xs text-red-400">{message}</p>}

                                <div className="flex gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="w-full">Cancel</Button>
                                    <Button type="submit" loading={isCreatingMutation} className="w-full">Create</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
