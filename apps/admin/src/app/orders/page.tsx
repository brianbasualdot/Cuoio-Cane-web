import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
    return (
        <PageShell title="Pedidos">
            <EmptyState
                title="Sin pedidos recientes"
                description="Los nuevos pedidos de la tienda aparecerán aquí."
                icon={ShoppingBag}
            />
        </PageShell>
    );
}
