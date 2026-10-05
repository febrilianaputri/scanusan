import { useState } from 'react';

type TxTab = 'in' | 'out';
type ScanState = 'waiting' | 'scanning' | 'found' | 'not-found' | 'insufficient' | 'success' | 'failed';

const FOUND_PRODUCT = {
  barcode: '899001234567',
  name: 'CAT6 UTP Cable',
  currentStock: 35,
};

export default function StockTransaction() {
  const [tab, setTab] = useState<TxTab>('in');
  const [scanState, setScanState] = useState<ScanState>('waiting');
  const [quantity, setQuantity] = useState(1);
  const [simulating, setSimulating] = useState(false);

  const simulate = () => {
    if (simulating) return;
    setSimulating(true);
    setScanState('scanning');
    setTimeout(() => {
      setScanState('found');
      setSimulating(false);
    }, 1500);
  };

  const confirm = () => {
    if (tab === 'out' && quantity > FOUND_PRODUCT.currentStock) {
      setScanState('insufficient');
      return;
    }
    setScanState('success');
    setTimeout(() => { setScanState('waiting'); setQuantity(1); }, 3000);
  };

  const reset = () => { setScanState('waiting'); setQuantity(1); };

  const newStock = tab === 'in'
    ? FOUND_PRODUCT.currentStock + quantity
    : FOUND_PRODUCT.currentStock - quantity;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {(['in', 'out'] as TxTab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); reset(); }}
            className="px-6 py-2 rounded-lg text-sm font-semibold font-body transition-all"
            style={tab === t
              ? { background: t === 'in' ? 'var(--success)' : 'var(--danger)', color: '#fff' }
              : { color: 'var(--muted-foreground)' }}
          >
            {t === 'in' ? '↑ STOCK IN' : '↓ STOCK OUT'}
          </button>
        ))}
      </div>

      {/* Scanner info */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center gap-3"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75"></div>
        </div>
        <div>
          <div className="font-display font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Scanner-01</div>
          <div className="text-xs" style={{ color: 'var(--success)' }}>Connected • Ready to scan</div>
        </div>
        <div className="ml-auto flex gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span>📶 Excellent</span>
          <span>🔋 72%</span>
        </div>
      </div>

      {/* Main scan area */}
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {scanState === 'waiting' && (
          <>
            <div className="text-6xl animate-pulse">📡</div>
            <div className="text-center">
              <p className="font-display font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                Waiting for barcode...
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Point your IoT scanner at a product barcode
              </p>
            </div>
            <button
              onClick={simulate}
              className="px-6 py-3 rounded-xl text-sm font-semibold font-body"
              style={{ background: 'var(--muted)', color: 'var(--primary)', border: '1px solid var(--border)' }}
            >
              ▶ Simulate Scan
            </button>
          </>
        )}

        {scanState === 'scanning' && (
          <>
            <div className="text-6xl">📡</div>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-3 h-3 rounded-full animate-bounce"
                  style={{ background: 'var(--primary)', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="font-display font-bold text-xl" style={{ color: 'var(--primary)' }}>SCANNING...</p>
          </>
        )}

        {scanState === 'found' && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span className="font-display font-semibold" style={{ color: 'var(--success)' }}>Barcode Detected</span>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--muted)' }}>
              <div className="text-xs font-mono mb-1" style={{ color: 'var(--muted-foreground)' }}>{FOUND_PRODUCT.barcode}</div>
              <div className="font-display font-semibold text-lg" style={{ color: 'var(--foreground)' }}>{FOUND_PRODUCT.name}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Current Stock: <strong style={{ color: 'var(--foreground)' }}>{FOUND_PRODUCT.currentStock} pcs</strong>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold font-body" style={{ color: 'var(--muted-foreground)' }}>Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl font-bold text-lg"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  −
                </button>
                <span className="font-display font-bold text-3xl w-16 text-center" style={{ color: 'var(--foreground)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl font-bold text-lg"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  +
                </button>
                <div className="ml-4 rounded-xl px-4 py-2" style={{ background: 'var(--muted)' }}>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>New Stock</div>
                  <div className="font-bold font-display" style={{ color: newStock < 0 ? 'var(--danger)' : 'var(--foreground)' }}>
                    {newStock} pcs
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-3 rounded-xl text-sm font-semibold font-body"
                style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                Cancel
              </button>
              <button onClick={confirm} className="flex-1 py-3 rounded-xl text-sm font-semibold font-body"
                style={{ background: tab === 'in' ? 'var(--success)' : 'var(--danger)', color: '#fff' }}>
                Confirm Stock {tab === 'in' ? 'In' : 'Out'}
              </button>
            </div>
          </div>
        )}

        {scanState === 'insufficient' && (
          <div className="w-full text-center flex flex-col items-center gap-3">
            <div className="text-5xl">⚠</div>
            <p className="font-display font-semibold text-lg" style={{ color: 'var(--warning)' }}>Insufficient Stock</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Requested {quantity} pcs but only {FOUND_PRODUCT.currentStock} pcs available
            </p>
            <button onClick={() => setScanState('found')} className="px-6 py-2.5 rounded-xl text-sm font-semibold font-body"
              style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
              ← Adjust Quantity
            </button>
          </div>
        )}

        {scanState === 'success' && (
          <div className="w-full text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'rgba(106,168,79,0.15)' }}>
              ✓
            </div>
            <p className="font-display font-semibold text-xl" style={{ color: 'var(--success)' }}>
              Transaction Successful!
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Stock {tab === 'in' ? 'In' : 'Out'}: {quantity} pcs • {FOUND_PRODUCT.name}
            </p>
            <p className="text-sm">
              <span style={{ color: 'var(--muted-foreground)' }}>New Stock: </span>
              <strong style={{ color: 'var(--foreground)' }}>{newStock} pcs</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
