'use client';

import { useState, useEffect } from 'react';
import { SummaryCards } from './SummaryCards';
import { TopProducts } from './TopProducts';
import { LocationsList } from './LocationsList';
import { ExportModal } from './ExportModal';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Period = 'week' | 'month' | 'year';

export function ReportsView() {
    const [period, setPeriod] = useState<Period>('week');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showExport, setShowExport] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Assuming API is proxied or we use absolute URL if needed. 
                // For dev, if API is on 3000 and Admin on 3001, we might need localhost:3000.
                // Let's try relative /api path if proxy exists, or assume NEXT_PUBLIC_API_URL env var exists.
                // If not, I'll fallback to hardcoded localhost:3000 for this task or relative if standard nextjs rewrite.
                // Checking previous code: usually fetch runs on server or client. 

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
                const res = await fetch(`${apiUrl}/reports/${period === 'week' ? 'weekly' : period === 'monthly' ? 'monthly' : 'yearly'}`);

                if (!res.ok) throw new Error('Failed to fetch data');
                const jsonData = await res.json();
                setData(jsonData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [period]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="font-display text-2xl font-normal text-white">Reportes</h2>
                    <p className="text-zinc-400 font-light text-sm">
                        Visión general del desempeño del negocio.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-surface border border-border-subtle rounded-token-md p-1">
                        <PeriodButton active={period === 'week'} onClick={() => setPeriod('week')}>Semana</PeriodButton>
                        <PeriodButton active={period === 'month'} onClick={() => setPeriod('month')}>Mes</PeriodButton>
                        <PeriodButton active={period === 'year'} onClick={() => setPeriod('year')}>Año</PeriodButton>
                    </div>

                    <button
                        onClick={() => setShowExport(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-token-md border border-border-subtle transition-colors"
                    >
                        Exportar
                    </button>
                </div>
            </div>

            <ExportModal
                open={showExport}
                onClose={() => setShowExport(false)}
                period={period}
            />

            {/* Content */}
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                </div>
            ) : data ? (
                <div className="space-y-8">
                    <SummaryCards data={data.sales} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TopProducts products={data.products.byRevenue} />
                        <LocationsList locations={data.locations} />
                    </div>
                </div>
            ) : (
                <div className="text-center text-zinc-500 py-10">Error al cargar datos.</div>
            )}
        </div>
    );
}

function PeriodButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-sm transition-all duration-200",
                active
                    ? "bg-zinc-700 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            )}
        >
            {children}
        </button>
    );
}
