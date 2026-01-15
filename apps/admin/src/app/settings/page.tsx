import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <PageShell title="Configuración">
            <div className="max-w-2xl space-y-8">
                <div className="p-6 border border-[var(--border)] rounded-sm bg-[var(--surface)]">
                    <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">General</h3>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]">Nombre de la Tienda</label>
                            <input type="text" value="Cuoio Cane" disabled className="bg-[var(--background)] border border-[var(--border)] p-2 text-sm text-[var(--text-secondary)] rounded-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
