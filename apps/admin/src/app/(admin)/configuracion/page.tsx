export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-normal text-white">Configuración</h2>
            </div>
            <div className="max-w-xl">
                <div className="p-6 border border-border-subtle rounded-token-lg bg-surface space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-zinc-300">General</h3>
                        <p className="text-xs text-zinc-500">Información básica de la tienda.</p>
                    </div>
                    <div className="h-px bg-border-subtle" />
                    <div>
                        <h3 className="text-sm font-medium text-zinc-300">Usuarios</h3>
                        <p className="text-xs text-zinc-500">Gestión de permisos y staff.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
