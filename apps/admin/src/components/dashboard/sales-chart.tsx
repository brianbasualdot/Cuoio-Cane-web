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
        // CONTAINER: Rigid Border, same BG as other cards
        <div className="h-full w-full min-h-[350px] flex flex-col">

            {/* CHART AREA */}
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-coffee)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent-coffee)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'var(--font-inter)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            dy={10}
                        />
                        <YAxis hide={true} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--surface)',
                                borderColor: 'var(--border)',
                                borderRadius: '4px',
                                boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.5)',
                                padding: '8px 12px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: 'var(--text-primary)', fontFamily: 'var(--font-inter)' }}
                            cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            formatter={(value: number) => [`$${value}`, 'Ventas']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--accent-copper)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
