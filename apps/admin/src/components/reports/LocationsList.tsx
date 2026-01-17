import { Card } from '@/components/ui/CardContainer';
import { MapPin } from 'lucide-react';

interface LocationStat {
    name: string;
    count: number;
}

export function LocationsList({ locations }: { locations: LocationStat[] }) {
    // Calculate total for percentage
    const total = locations.reduce((sum, loc) => sum + loc.count, 0);

    return (
        <Card className="p-6 border-border-subtle bg-surface h-full">
            <h3 className="text-white font-display text-lg mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-zinc-500" />
                Top Localidades
            </h3>
            <div className="space-y-5">
                {locations.length === 0 ? (
                    <p className="text-zinc-500 text-sm">No hay datos disponibles.</p>
                ) : (
                    locations.map((loc, index) => {
                        const percent = total > 0 ? (loc.count / total) * 100 : 0;
                        return (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-300">{loc.name}</span>
                                    <span className="text-zinc-500 font-mono">{loc.count} pedidos</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-zinc-500 rounded-full"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Card>
    );
}
