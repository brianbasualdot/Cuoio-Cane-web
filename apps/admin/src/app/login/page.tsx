'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/CardContainer';
import { Input } from '@/components/ui/InputField';
import { login } from './actions';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full mt-2" size="sm" type="submit" loading={pending}>
            {pending ? 'Ingresando...' : 'Ingresar'}
        </Button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-4xl font-bold text-white tracking-tight">Cuoio Cane</h1>
                    <p className="mt-2 text-xs uppercase tracking-widest text-zinc-500">Atelier Admin</p>
                </div>

                <Card className="border-border-subtle bg-surface/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Bienvenido</CardTitle>
                        <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Email</label>
                                <Input type="email" name="email" placeholder="admin@cuoiocane.com" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400">Contraseña</label>
                                <Input type="password" name="password" placeholder="••••••••" required />
                            </div>

                            {state?.error && (
                                <div className="flex items-center gap-2 p-3 text-xs text-red-200 bg-red-900/40 border border-red-900/50 rounded-md">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{state.error}</span>
                                </div>
                            )}

                            <SubmitButton />
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-zinc-600">
                    Solo personal autorizado.
                </p>
            </div>
        </div>
    );
}
