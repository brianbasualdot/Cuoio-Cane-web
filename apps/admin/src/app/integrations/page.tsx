import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Share2 } from "lucide-react";

export default function IntegrationsPage() {
    return (
        <PageShell title="Integraciones">
            <EmptyState
                title="Sin integraciones activas"
                description="Conecta servicios externos aquí."
                icon={Share2}
            />
        </PageShell>
    );
}
