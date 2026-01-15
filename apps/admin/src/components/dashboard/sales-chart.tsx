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
        <div className="h-[350px] w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm p-6 relative group overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">Tendencia de Ventas</h3>
                <select className="bg-transparent text-xs font-sans text-[var(--text-primary)] border border-[var(--border)] rounded-sm px-3 py-1.5 focus:outline-none focus:border-[var(--accent-copper)] transition-colors cursor-pointer">
                    <option>Últimos 7 días</option>
                    <option>Este Mes</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-copper)" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="var(--accent-copper)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-inter)' }}
                        dy={10}
                    />
                    <YAxis
                        hide={true}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--border)',
                            borderRadius: '0px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{ color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-inter)' }}
                        cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent-copper)"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
