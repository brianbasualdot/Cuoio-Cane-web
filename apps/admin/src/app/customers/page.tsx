import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

export default function CustomersPage() {
    return (
        <PageShell title="Clientes">
            <EmptyState
                title="Base de clientes vacía"
                description="Aquí podrás gestionar la información de tus compradores."
                icon={Users}
            />
        </PageShell>
    );
}
