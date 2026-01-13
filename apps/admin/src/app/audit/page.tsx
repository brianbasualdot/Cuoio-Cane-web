import { createClient } from '@/lib/supabase/server';
import { AlertCircle } from 'lucide-react';

export default async function AuditPage() {
    const supabase = await createClient();
    const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Audit Logs (Seguridad)</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3">Acción</th>
                            <th className="px-6 py-3">Tabla</th>
                            <th className="px-6 py-3">Usuario (ID)</th>
                            <th className="px-6 py-3">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs?.map((log: any) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{log.action}</td>
                                <td className="px-6 py-4 font-mono text-xs">{log.table_name}</td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.user_id || 'System'}</td>
                                <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                                    {JSON.stringify(log.new_data || log.old_data || {})}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
