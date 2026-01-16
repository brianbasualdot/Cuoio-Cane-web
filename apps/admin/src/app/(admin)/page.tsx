export default function AdminHomePage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl font-normal text-white">
                    Bienvenido
                </h2>
                <p className="text-zinc-400 max-w-2xl font-light">
                    Panel de administración Cuoio Cane. Seleccione una opción del menú lateral para comenzar a gestionar el catálogo, pedidos o configuración del sistema.
                </p>
            </div>

            <div className="h-px w-full bg-border-subtle" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-4 border border-border-subtle rounded-token-md bg-surface/50">
                    <h3 className="text-sm font-medium text-zinc-300 mb-1">Estado del Sistema</h3>
                    <div className="text-xs text-emerald-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Operativo
                    </div>
                </div>
            </div>
        </div>
    );
}
