import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/StatCard';
import LiveScanCenter from '../components/LiveScanCenter';
import { transactions, stockMovementData, weeklyData, monthlyData } from '../data/mockData';

const timeFilters = ['Today', '7 Days', '30 Days'];

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('Today');

  const chartData =
    activeFilter === 'Today' ? stockMovementData :
    activeFilter === '7 Days' ? weeklyData :
    monthlyData;

  const xKey = activeFilter === 'Today' ? 'time' : activeFilter === '7 Days' ? 'day' : 'week';

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon="📦" label="Total Items" value="1,284" trend="+3.2%" trendUp />
        <StatCard icon="↑" label="Stock In Today" value="+120" trend="+15%" trendUp accent="rgba(106,168,79,0.12)" />
        <StatCard icon="↓" label="Stock Out Today" value="-85" trend="-8%" accent="rgba(217,83,79,0.08)" />
        <StatCard icon="⚠" label="Low Stock" value="12" trend="12 items" accent="rgba(233,180,76,0.12)" />
        <StatCard icon="🔴" label="Out of Stock" value="4" trend="4 items" accent="rgba(217,83,79,0.08)" />
      </div>

      {/* Charts + scanner row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stock Movement Chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base" style={{ color: 'var(--foreground)' }}>
              Stock Movement
            </h2>
            <div className="flex gap-1">
              {timeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all"
                  style={
                    activeFilter === f
                      ? { background: 'var(--primary)', color: 'var(--primary-foreground)' }
                      : { background: 'var(--muted)', color: 'var(--muted-foreground)' }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={xKey} stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--muted-foreground)' }} />
              <Line type="monotone" dataKey="in" stroke="var(--primary)" strokeWidth={2} dot={false} name="Stock In" />
              <Line type="monotone" dataKey="out" stroke="#D9534F" strokeWidth={2} dot={false} name="Stock Out" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Scanner status + Live scan */}
        <div className="flex flex-col gap-4">
          {/* Scanner health */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <div className="absolute inset-0 animate-ping w-2.5 h-2.5 rounded-full bg-green-400 opacity-75"></div>
              </div>
              <span className="font-display font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                Scanner-01
              </span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }}>
                Online
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'WiFi', value: 'Excellent', icon: '📶' },
                { label: 'Battery', value: '72%', icon: '🔋' },
                { label: 'Last Scan', value: '10:32:21', icon: '⏱' },
                { label: 'Total Scans', value: '248', icon: '◎' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl px-3 py-2" style={{ background: 'var(--muted)' }}>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.icon} {item.label}</div>
                  <div className="font-semibold text-sm font-body mt-0.5" style={{ color: 'var(--foreground)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <LiveScanCenter />
        </div>
      </div>

      {/* Transactions + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent transactions */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--foreground)' }}>
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Time', 'Product', 'Type', 'Qty', 'Scanner', 'User'].map((h) => (
                    <th key={h} className="text-left pb-2 pr-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((tx) => (
                  <tr
                    key={tx.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-2.5 pr-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{tx.time}</td>
                    <td className="py-2.5 pr-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{tx.product}</td>
                    <td className="py-2.5 pr-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={tx.type === 'in'
                          ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                          : { background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }}
                      >
                        {tx.type === 'in' ? 'IN' : 'OUT'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-xs font-semibold" style={{ color: tx.type === 'in' ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                    </td>
                    <td className="py-2.5 pr-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.scanner}</td>
                    <td className="py-2.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock alerts */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--foreground)' }}>
            Low Stock Alerts
          </h2>
          <div className="flex flex-col gap-2">
            {[
              { name: 'RJ45 Connector', stock: 8, min: 10 },
              { name: 'USB-C Adapter', stock: 4, min: 8 },
              { name: 'HDMI Cable 2m', stock: 0, min: 5 },
              { name: 'Ethernet Switch 8P', stock: 0, min: 2 },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 px-3 py-3 rounded-xl"
                style={{ background: 'var(--muted)' }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: item.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold font-body truncate" style={{ color: 'var(--foreground)' }}>
                    {item.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {item.stock === 0 ? 'Out of stock' : `${item.stock} pcs remaining`}
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                  style={item.stock === 0
                    ? { background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }
                    : { background: 'rgba(233,180,76,0.12)', color: 'var(--warning)' }}
                >
                  {item.stock === 0 ? 'Empty' : 'Low'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
