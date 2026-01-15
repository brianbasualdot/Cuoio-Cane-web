'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    { name: 'Lun', value: 4000 },
    { name: 'Mar', value: 3000 },
    { name: 'Mie', value: 2000 },
    { name: 'Jue', value: 2780 },
    { name: 'Vie', value: 1890 },
    { name: 'Sab', value: 2390 },
    { name: 'Dom', value: 3490 },
];

export function SalesChart() {
    return (
        <div className="h-[300px] w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm p-6 relative group overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-60">Tendencia de Ventas</h3>
                <select className="bg-transparent text-[10px] text-[var(--text-primary)] border border-[var(--border)] rounded-sm px-2 py-1 focus:outline-none">
                    <option>Últimos 7 días</option>
                    <option>Este Mes</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#b8860b" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'monospace' }}
                        dy={10}
                    />
                    <YAxis
                        hide={true}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '4px' }}
                        itemStyle={{ color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'monospace' }}
                        cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#b8860b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
