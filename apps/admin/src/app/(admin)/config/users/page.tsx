'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/CardContainer';
import { Plus, Trash2, Edit, Loader2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/ActionButton';
import { cn } from '@/lib/utils'; // Assuming utils location

interface StaffMember {
    id: string;
    alias: string;
    operative_code: string;
    is_active: boolean;
}

export default function StaffPage() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Modal State
    const [formAlias, setFormAlias] = useState('');
    const [formCode, setFormCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/staff`);
            if (res.ok) {
                const data = await res.json();
                setStaff(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setMessage('');

        try {
            const res = await fetch(`${apiUrl}/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alias: formAlias, code: formCode })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create');
            }

            setShowModal(false);
            setFormAlias('');
            setFormCode('');
            fetchStaff();
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setCreating(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`${apiUrl}/staff/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchStaff();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this staff member? This cannot be undone.')) return;
        try {
            await fetch(`${apiUrl}/staff/${id}`, { method: 'DELETE' });
            fetchStaff();
        } catch (e) {
            console.error(e);
        }
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
                                    <Button type="submit" loading={creating} className="w-full">Create</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
