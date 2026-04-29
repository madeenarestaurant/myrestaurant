import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { clsx } from 'clsx';
import { format, subDays, subMonths } from 'date-fns';

const PERIODS = [
  { id: 'daily', label: 'Daily', days: 7 },
  { id: 'monthly', label: 'Monthly', days: 30 },
  { id: 'yearly', label: 'Yearly', days: 365 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-4 min-w-[160px]">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-6 mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[10px] font-bold text-gray-500 capitalize">{entry.name}</span>
            </div>
            <span className="text-[11px] font-black text-gray-800">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsChart = ({ orders = [], reservations = [], visitors = [] }) => {
  const [period, setPeriod] = useState('daily');

  const chartData = useMemo(() => {
    const now = new Date();

    if (period === 'daily') {
      // Last 7 days — one bar per day
      const days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
      return days.map((day) => {
        const label = format(day, 'EEE');
        const dateStr = format(day, 'yyyy-MM-dd');
        return {
          label,
          orders: orders.filter(o => format(new Date(o.createdAt), 'yyyy-MM-dd') === dateStr).length,
          reservations: reservations.filter(r => format(new Date(r.createdAt), 'yyyy-MM-dd') === dateStr).length,
          visitors: visitors.filter(v => format(new Date(v.lastVisit), 'yyyy-MM-dd') === dateStr).length,
        };
      });
    }

    if (period === 'monthly') {
      // Last 6 months — one point per month week groups
      const months = Array.from({ length: 6 }, (_, i) => subMonths(now, 5 - i));
      return months.map((month) => {
        const label = format(month, 'MMM');
        const monthStr = format(month, 'yyyy-MM');
        return {
          label,
          orders: orders.filter(o => format(new Date(o.createdAt), 'yyyy-MM') === monthStr).length,
          reservations: reservations.filter(r => format(new Date(r.createdAt), 'yyyy-MM') === monthStr).length,
          visitors: visitors.filter(v => format(new Date(v.lastVisit), 'yyyy-MM') === monthStr).length,
        };
      });
    }

    if (period === 'yearly') {
      // Last 12 months — one point per month
      const months = Array.from({ length: 12 }, (_, i) => subMonths(now, 11 - i));
      return months.map((month) => {
        const label = format(month, 'MMM yy');
        const monthStr = format(month, 'yyyy-MM');
        return {
          label,
          orders: orders.filter(o => format(new Date(o.createdAt), 'yyyy-MM') === monthStr).length,
          reservations: reservations.filter(r => format(new Date(r.createdAt), 'yyyy-MM') === monthStr).length,
          visitors: visitors.filter(v => format(new Date(v.lastVisit), 'yyyy-MM') === monthStr).length,
        };
      });
    }

    return [];
  }, [period, orders, reservations, visitors]);

  const totals = useMemo(() => ({
    orders: chartData.reduce((sum, d) => sum + d.orders, 0),
    reservations: chartData.reduce((sum, d) => sum + d.reservations, 0),
    visitors: chartData.reduce((sum, d) => sum + d.visitors, 0),
  }), [chartData]);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-800 tracking-tight">Activity Analytics</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Orders · Reservations · Visitors
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-fit self-start">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={clsx(
                'px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all',
                period === p.id
                  ? 'bg-white text-[#8B3B3B] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Totals */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[#8B3B3B]/5 rounded-2xl p-4">
          <p className="text-[8px] font-black text-[#8B3B3B] uppercase tracking-widest mb-1">Orders</p>
          <p className="text-2xl font-black text-gray-800">{totals.orders}</p>
        </div>
        <div className="bg-indigo-50 rounded-2xl p-4">
          <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1">Reservations</p>
          <p className="text-2xl font-black text-gray-800">{totals.reservations}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4">
          <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Visitors</p>
          <p className="text-2xl font-black text-gray-800">{totals.visitors}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B3B3B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#8B3B3B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fontWeight: 800, fill: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fontWeight: 800, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />

            <Area
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#colorVisitors)"
              dot={false}
              activeDot={{ r: 5, fill: '#10B981', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="reservations"
              name="Reservations"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#colorReservations)"
              dot={false}
              activeDot={{ r: 5, fill: '#6366F1', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#8B3B3B"
              strokeWidth={2.5}
              fill="url(#colorOrders)"
              dot={false}
              activeDot={{ r: 5, fill: '#8B3B3B', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-6 pt-5 border-t border-gray-50">
        {[
          { color: '#8B3B3B', label: 'Orders' },
          { color: '#6366F1', label: 'Reservations' },
          { color: '#10B981', label: 'Visitors' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsChart;
