import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Layers } from "lucide-react";

export default function CategoriesPage() {
    return (
        <PageShell title="Categorías">
            <EmptyState
                title="Sin categorías"
                description="Organiza tus productos en colecciones."
                icon={Layers}
            />
        </PageShell>
    );
}
