'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/CardContainer';
import { Button } from '@/components/ui/ActionButton';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';

export function AliasConfirmationModal() {
    const [open, setOpen] = useState(false);
    const [alias, setAlias] = useState('');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();


    useEffect(() => {
        const supabase = createClient();
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.user_metadata?.role === 'staff') {
                // Assuming we pass alias in metadata or we fetch profile
                // We can fetch profile to be sure
                const { data: profile } = await supabase.from('profiles').select('alias').eq('id', user.id).single();
                if (profile) {
                    setAlias(profile.alias);
                    setOpen(true);
                    setUser(user);
                }
            }
        };
        checkUser();
    }, []);

    const handleConfirm = () => {
        setOpen(false);
        // Maybe log confirmation?
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-300">
                <CardHeader className="text-center pb-2">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LockKeyhole className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">Confirmá tu identidad</CardTitle>
                    <CardDescription>Estás ingresando como usuario operativo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-surface border border-border-subtle rounded-lg p-6 text-center">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Alias Activo</p>
                        <p className="text-3xl font-display font-bold text-white tracking-tight">{alias}</p>
                    </div>

                    <Button onClick={handleConfirm} className="w-full" size="lg">
                        Confirmar Acceso
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
