'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const data = [
    { name: '00:00', value: 12 },
    { name: '04:00', value: 8 },
    { name: '08:00', value: 24 },
    { name: '12:00', value: 18 },
    { name: '16:00', value: 35 },
    { name: '20:00', value: 42 },
];

export function ActivityChart() {
    return (
        <div className="h-[300px] w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm p-6">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--text-secondary)] opacity-60 mb-8">Actividad Horaria</h3>

            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 9, fontFamily: 'monospace' }}
                        dy={10}
                    />
                    <Tooltip
                        cursor={{ fill: 'var(--surface-hover)' }}
                        contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '4px' }}
                        itemStyle={{ color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="value" fill="var(--surface-hover)" radius={[2, 2, 0, 0]} activeBar={{ fill: 'var(--accent-copper)' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
