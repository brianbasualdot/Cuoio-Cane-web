import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/ActionButton';

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-center px-4">
            <div className="bg-surface p-4 rounded-full border border-border-subtle mb-4">
                <ShieldAlert className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">Acceso No Autorizado</h1>
            <p className="text-zinc-400 max-w-md mb-6 text-sm">
                No tienes permisos para acceder al panel de administración. Si crees que esto es un error, contacta al administrador del sistema.
            </p>
            <Button asChild variant="secondary" size="sm">
                <Link href="/login">Volver al Login</Link>
            </Button>
        </div>
    );
}
