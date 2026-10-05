import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';

type Tab = 'all' | 'in' | 'out';

export default function Transactions() {
  const { data } = useAppData();
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [scanner, setScanner] = useState('All Scanners');
  const [user, setUser] = useState('All Users');

  const filtered = data.transactions.filter((tx) => {
    const matchTab = tab === 'all' || tx.type === tab;
    const matchSearch = tx.product.toLowerCase().includes(search.toLowerCase()) || tx.barcode.includes(search);
    return matchTab && matchSearch && (scanner === 'All Scanners' || tx.scanner === scanner) && (user === 'All Users' || tx.user === user);
  });
  const scanners = [...new Set(data.transactions.map((transaction) => transaction.scanner))];
  const users = [...new Set(data.transactions.map((transaction) => transaction.user))];

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {(['all', 'in', 'out'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-semibold font-body capitalize transition-all"
            style={tab === t
              ? { background: 'var(--card)', color: 'var(--foreground)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
              : { color: 'var(--muted-foreground)' }}
          >
            {t === 'all' ? 'All' : `Stock ${t === 'in' ? 'In' : 'Out'}`}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--muted-foreground)' }}>🔍</span>
          <input
            placeholder="Search product or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm font-body w-44"
            style={{ color: 'var(--foreground)' }}
          />
        </div>
        <select value={scanner} onChange={(event) => setScanner(event.target.value)} className="px-3 py-2 rounded-xl text-sm font-body outline-none"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
          <option>All Scanners</option>
          {scanners.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select value={user} onChange={(event) => setUser(event.target.value)} className="px-3 py-2 rounded-xl text-sm font-body outline-none"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
          <option>All Users</option>
          {users.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Time', 'Barcode', 'Product', 'Type', 'Qty', 'Prev Stock', 'Current Stock', 'Scanner', 'User'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{tx.time}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {tx.barcode}
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{tx.product}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={tx.type === 'in'
                        ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                        : { background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }}
                    >
                      Stock {tx.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm"
                    style={{ color: tx.type === 'in' ? 'var(--success)' : 'var(--danger)' }}>
                    {tx.type === 'in' ? '+' : '-'}{tx.quantity} pcs
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.prevStock}</td>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{tx.currentStock}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.scanner}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
