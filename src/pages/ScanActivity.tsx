import { transactions } from '../data/mockData';

export default function ScanActivity() {
  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Scans Today', value: '248', color: 'var(--primary)' },
          { label: 'Successful', value: '241', color: 'var(--success)' },
          { label: 'Failed', value: '7', color: 'var(--danger)' },
          { label: 'Active Scanners', value: '1/2', color: 'var(--info)' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-body mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75"></div>
          </div>
          <h2 className="font-display font-semibold" style={{ color: 'var(--foreground)' }}>Real-Time Feed</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['#', 'Time', 'Scanner', 'Barcode', 'Product', 'Action', 'Qty', 'Result'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)', background: i === 0 ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'transparent' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i === 0 ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'transparent')}
                >
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {String(transactions.length - i).padStart(3, '0')}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{tx.time}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--primary)' }}>{tx.scanner}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {tx.barcode.slice(0, 9)}...
                  </td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{tx.product}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={tx.type === 'in'
                        ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                        : { background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }}>
                      {tx.type === 'in' ? '↑ IN' : '↓ OUT'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold"
                    style={{ color: tx.type === 'in' ? 'var(--success)' : 'var(--danger)' }}>
                    {tx.type === 'in' ? '+' : '-'}{tx.quantity}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }}>
                      ✓ OK
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
