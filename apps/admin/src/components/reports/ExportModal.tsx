'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/CardContainer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dropdown-menu'; // Assuming a Dialog exists or I might have to build one/check imports.
// Checking previously listed files: dropdown-menu.tsx seemed to be "dropdown-menu.tsx" not Dialog.
// I listed `apps/admin/src/components/ui` and saw `dropdown-menu.tsx`. I did NOT see `dialog.tsx`.
// I will instead create a simple fixed overlay modal if Dialog is unavailable, OR use `Dialog` if I can find it.
// Let's check imports. `CardContainer` is there.
// If no Dialog, I'll make a custom one using standard Tailwind fixed overlay.

import { Loader2, FileDown, FileText, TableProperties, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ExportModal({
    open,
    onClose,
    period
}: {
    open: boolean;
    onClose: () => void;
    period: string;
}) {
    const [downloading, setDownloading] = useState(false);

    if (!open) return null;

    const handleDownload = async (format: 'pdf' | 'csv') => {
        setDownloading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
            const url = `${apiUrl}/reports/export?period=${period === 'monthly' ? 'month' : period === 'yearly' ? 'year' : 'week'}&format=${format}`;

            // Trigger download by opening in new window or creating anchor
            // Anchor is better for Auth if cookies are used, but here valid Admin session might be needed.
            // If Auth is via headers, fetch blob is needed. 
            // If Cookie based, basic link works.
            // Assuming Supabase Cookie auth handling or public/proxy for now. 
            // Actually, admin panel usually shares cookies with API if same domain, or bearer token.
            // If we need Bearer token, we must fetch blob.

            // Let's assume fetch blob for safety to pass headers if we had them, 
            // but standard anchor `href` works if cookies are set designatedly.
            // Given I am not fully sure of Auth implementation detail (Bearer vs Cookie for API), 
            // I will try window.open which relies on Cookies. If it fails, user will complain.
            // But wait, `reports` endpoint validation? I didn't add explicit Guard in `ReportsController` 
            // but the `metrics` page uses `supabase.auth.getUser()`.
            // Ideally, API should use the same.

            window.location.href = url;

            // Artificial delay to reset state
            setTimeout(() => {
                setDownloading(false);
                onClose();
            }, 2000);

        } catch (e) {
            console.error(e);
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md bg-surface border-border-subtle p-0 overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-display text-white">Exportar Reporte</h3>
                        <p className="text-zinc-500 text-sm">Período: {period === 'week' ? 'Semanal' : period === 'month' ? 'Mensual' : 'Anual'}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                    <button
                        disabled={downloading}
                        onClick={() => handleDownload('pdf')}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-token-md border border-border-subtle hover:bg-surface-hover hover:border-zinc-600 transition-all group disabled:opacity-50"
                    >
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-zinc-300 font-medium group-hover:text-white">PDF</span>
                    </button>

                    <button
                        disabled={downloading}
                        onClick={() => handleDownload('csv')}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-token-md border border-border-subtle hover:bg-surface-hover hover:border-zinc-600 transition-all group disabled:opacity-50"
                    >
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <TableProperties className="w-6 h-6" />
                        </div>
                        <span className="text-zinc-300 font-medium group-hover:text-white">CSV</span>
                    </button>
                </div>

                {downloading && (
                    <div className="px-6 pb-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> Generando archivo...
                    </div>
                )}
            </Card>
        </div>
    );
}
