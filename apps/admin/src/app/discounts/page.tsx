import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Tag } from "lucide-react";

export default function DiscountsPage() {
    return (
        <PageShell title="Descuentos">
            <EmptyState
                title="No hay descuentos activos"
                description="Crea códigos promocionales para tus clientes."
                icon={Tag}
                action={
                    <button className="px-4 py-2 mt-4 bg-[var(--surface-hover)] border border-[var(--border)] rounded-sm text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-copper)] transition-colors">
                        Crear Descuento
                    </button>
                }
            />
        </PageShell>
    );
}
