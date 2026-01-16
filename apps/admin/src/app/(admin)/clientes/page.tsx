export default function CustomersPage() {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-700">
            <div className="p-4 rounded-full bg-surface border border-border-subtle">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-500"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            </div>
            <div>
                <h3 className="text-lg font-serif text-zinc-300">Aún no hay clientes</h3>
                <p className="text-sm text-zinc-500 max-w-sm mt-1">
                    La base de datos de clientes aparecerá aquí una vez que se realicen las primeras compras.
                </p>
            </div>
        </div>
    );
}
