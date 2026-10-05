import { useState, useEffect } from 'react';

type ScanState = 'waiting' | 'scanning' | 'success' | 'error';

const SUCCESS_DATA = {
  barcode: '899001234567',
  product: 'CAT6 UTP Cable',
  type: 'STOCK OUT',
  quantity: -5,
  prevStock: 40,
  newStock: 35,
  scanner: 'Scanner-01',
};

export default function LiveScanCenter() {
  const [state, setState] = useState<ScanState>('waiting');
  const [simulating, setSimulating] = useState(false);

  const simulate = () => {
    if (simulating) return;
    setSimulating(true);
    setState('scanning');
    setTimeout(() => {
      setState(Math.random() > 0.2 ? 'success' : 'error');
      setSimulating(false);
    }, 1800);
  };

  const reset = () => setState('waiting');

  useEffect(() => {
    if (state === 'success' || state === 'error') {
      const t = setTimeout(reset, 5000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            {state === 'scanning' && (
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping"></div>
            )}
          </div>
          <span className="font-display font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
            LIVE SCAN
          </span>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }}>
          Scanner Online
        </span>
      </div>

      {/* State display */}
      <div
        className="rounded-xl p-4 flex flex-col items-center gap-3 min-h-[140px] justify-center transition-all duration-300"
        style={{ background: 'var(--muted)' }}
      >
        {state === 'waiting' && (
          <>
            <div className="text-4xl animate-pulse">📡</div>
            <p className="text-sm text-center font-body" style={{ color: 'var(--muted-foreground)' }}>
              Waiting for barcode scan...
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Scanner-01</p>
          </>
        )}

        {state === 'scanning' && (
          <>
            <div className="text-4xl">📡</div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'var(--primary)', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-sm font-semibold font-display" style={{ color: 'var(--primary)' }}>
              SCANNING...
            </p>
          </>
        )}

        {state === 'success' && (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: 'var(--success)' }}>✓</span>
              <span className="text-sm font-semibold font-display" style={{ color: 'var(--success)' }}>
                Barcode Detected
              </span>
            </div>
            <div className="text-xs font-mono py-1.5 px-2 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
              {SUCCESS_DATA.barcode}
            </div>
            <div className="font-semibold text-sm font-body" style={{ color: 'var(--foreground)' }}>
              {SUCCESS_DATA.product}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }}>
                {SUCCESS_DATA.type}
              </span>
              <span className="font-bold text-sm" style={{ color: 'var(--danger)' }}>
                {SUCCESS_DATA.quantity} pcs
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Stock: {SUCCESS_DATA.prevStock} → <strong style={{ color: 'var(--foreground)' }}>{SUCCESS_DATA.newStock}</strong>
            </div>
          </div>
        )}

        {state === 'error' && (
          <>
            <div className="text-3xl">⚠</div>
            <p className="text-sm font-semibold font-display" style={{ color: 'var(--warning)' }}>
              Unknown Barcode
            </p>
            <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>899001234567</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Product not registered</p>
          </>
        )}
      </div>

      <button
        onClick={state === 'waiting' ? simulate : reset}
        disabled={simulating}
        className="w-full py-2.5 rounded-xl text-sm font-semibold font-body transition-all duration-200"
        style={{
          background: simulating ? 'var(--muted)' : 'var(--primary)',
          color: simulating ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
          cursor: simulating ? 'not-allowed' : 'pointer',
        }}
      >
        {state === 'waiting' ? '▶ Simulate Scan' : state === 'scanning' ? 'Scanning...' : '↩ Reset'}
      </button>
    </div>
  );
}
