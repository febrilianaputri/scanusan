import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { weeklyData, products } from '../data/mockData';

const dateFilters = ['Today', 'This Week', 'This Month', 'Custom'];

export default function Reports() {
  const [activeFilter, setActiveFilter] = useState('This Week');

  return (
    <div className="flex flex-col gap-6">
      {/* Date filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
          {dateFilters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="px-3 py-2 rounded-lg text-sm font-semibold font-body transition-all"
              style={activeFilter === f
                ? { background: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { color: 'var(--muted-foreground)' }}>
              {f}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          ↓ Export Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Stock In', value: '535', icon: '↑', color: 'var(--success)' },
          { label: 'Total Stock Out', value: '403', icon: '↓', color: 'var(--danger)' },
          { label: 'Net Movement', value: '+132', icon: '≡', color: 'var(--info)' },
          { label: 'Total Transactions', value: '87', icon: '◎', color: 'var(--primary)' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
              <span className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
            </div>
            <div className="font-display font-bold text-2xl" style={{ color: 'var(--foreground)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--foreground)' }}>
          Stock In vs Stock Out
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--foreground)', fontSize: '12px',
            }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--muted-foreground)' }} />
            <Bar dataKey="in" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Stock In" />
            <Bar dataKey="out" fill="#D9534F" radius={[4, 4, 0, 0]} name="Stock Out" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top products */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--foreground)' }}>
          Top Moving Products
        </h2>
        <div className="flex flex-col gap-3">
          {products.slice(0, 5).map((p, i) => {
            const movement = Math.round(Math.random() * 150 + 20);
            const maxMove = 170;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-mono w-5 text-right" style={{ color: 'var(--muted-foreground)' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold font-body truncate" style={{ color: 'var(--foreground)' }}>
                      {p.name}
                    </span>
                    <span className="text-xs font-mono ml-2" style={{ color: 'var(--muted-foreground)' }}>
                      {movement} mvt
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(movement / maxMove) * 100}%`, background: 'var(--primary)' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
