import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart } from "lucide-react";

export default function ReportsPage() {
    return (
        <PageShell title="Reportes">
            <EmptyState
                title="Datos insuficientes"
                description="Los reportes se generarán cuando haya más actividad."
                icon={BarChart}
            />
        </PageShell>
    );
}
