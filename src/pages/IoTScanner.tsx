import { scanners, transactions } from '../data/mockData';

const wifiBars = (level: string) => {
  if (level === 'N/A') return '—';
  if (level === 'Excellent') return '████';
  if (level === 'Good') return '███░';
  return '██░░';
};

export default function IoTScanner() {
  return (
    <div className="flex flex-col gap-6">
      {/* Scanner cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scanners.map((scanner) => (
          <div
            key={scanner.id}
            className="rounded-2xl p-5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'var(--muted)' }}
                >
                  📡
                </div>
                <div>
                  <div className="font-display font-semibold" style={{ color: 'var(--foreground)' }}>
                    {scanner.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {scanner.firmware}
                  </div>
                </div>
              </div>
              <span
                className="text-xs px-3 py-1 rounded-full font-semibold"
                style={scanner.status === 'online'
                  ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                  : { background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }}
              >
                {scanner.status === 'online' ? '● Online' : '● Offline'}
              </span>
            </div>

            {scanner.status === 'online' ? (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'WiFi Signal', value: wifiBars(scanner.wifi), sub: scanner.wifi },
                  { label: 'Battery', value: `${scanner.battery}%`, sub: scanner.battery > 20 ? 'Good' : 'Low' },
                  { label: 'Last Scan', value: scanner.lastScan, sub: 'Today' },
                  { label: 'Total Scans', value: scanner.totalScans.toString(), sub: 'Today' },
                  { label: 'IP Address', value: scanner.ipAddress, sub: 'Local' },
                  { label: 'Uptime', value: scanner.uptime, sub: 'Active' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl px-3 py-2.5" style={{ background: 'var(--muted)' }}>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</div>
                    <div className="font-semibold text-sm font-body mt-0.5" style={{ color: 'var(--foreground)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-4 text-center" style={{ background: 'var(--muted)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Last seen: {scanner.lastSeen}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>
                  Device is unreachable. Check power and network.
                </p>
              </div>
            )}

            <button
              className="w-full py-2.5 rounded-xl text-sm font-semibold font-body transition-all"
              style={{
                background: 'var(--muted)',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
              }}
            >
              View Details →
            </button>
          </div>
        ))}
      </div>

      {/* Live scan activity */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75"></div>
          </div>
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--foreground)' }}>
            Live Scan Activity
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              className="flex items-start gap-4 px-4 py-3 rounded-xl transition-all"
              style={{
                background: i === 0 ? 'var(--muted)' : 'transparent',
                border: i === 0 ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full mt-1"
                  style={{ background: i === 0 ? 'var(--primary)' : 'var(--border)' }}
                />
                {i < transactions.length - 1 && (
                  <div className="w-px flex-1 min-h-[20px]" style={{ background: 'var(--border)' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{tx.time}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={tx.type === 'in'
                      ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                      : { background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }}
                  >
                    Stock {tx.type.toUpperCase()}
                  </span>
                  {i === 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: 'rgba(93,173,226,0.12)', color: 'var(--info)' }}>
                      New
                    </span>
                  )}
                </div>
                <div className="font-semibold text-sm font-body" style={{ color: 'var(--foreground)' }}>
                  {tx.product}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Barcode: {tx.barcode.slice(0, 9)}...</span>
                  <span style={{ color: tx.type === 'in' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                    {tx.type === 'in' ? '+' : '-'}{tx.quantity} pcs
                  </span>
                  <span>{tx.scanner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
