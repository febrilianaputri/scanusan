import { useState, useEffect } from 'react';
import { useAppData } from '../data/AppDataContext';
import type { Product } from '../types';
import { useLanguage } from '../i18n';
import { validateBarcode } from '../utils/barcodeValidator'; // 👈 Import validator

type ScanState = 'waiting' | 'scanning' | 'success' | 'error';

export default function LiveScanCenter() {
  const { t } = useLanguage();
  const { data, setData } = useAppData();
  const [state, setState] = useState<ScanState>('waiting');
  const [simulating, setSimulating] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const simulate = (inputBarcode?: string) => {
    if (simulating) return;
    setSimulating(true);
    setState('scanning');

    setTimeout(() => {
      // Ambil produk acak atau gunakan barcode uji coba
      const targetBarcode = inputBarcode || (data.products.length > 0 ? data.products[0].barcode : 'UNKNOWN-999');
      
      // 🛡️ VALIDASI OPSI B: Cek apakah barcode terdaftar di produk PT (Case-Insensitive)
      const check = validateBarcode(targetBarcode, data.products);

      if (!check.valid || !check.product) {
        setState('error');
        setErrorMessage(t('Barcode tidak dikenali / Bukan produk resmi PT!'));
        setSimulating(false);
        return;
      }

      const product = check.product;
      if (product.currentStock <= 0) {
        setState('error');
        setErrorMessage(t('Stok produk habis!'));
        setSimulating(false);
        return;
      }

      const now = new Date();
      const updatedProduct = {
        ...product,
        currentStock: product.currentStock - 1,
        status: product.currentStock - 1 === 0 ? 'out' as const : product.currentStock - 1 < product.minStock ? 'low' as const : 'good' as const,
      };

      setData((current) => ({
        ...current,
        products: current.products.map((item) => item.id === product.id ? updatedProduct : item),
        transactions: [{
          id: `tx-${now.getTime()}`,
          time: now.toLocaleTimeString('en-GB'),
          createdAt: now.toISOString(),
          barcode: product.barcode,
          product: product.name,
          type: 'out',
          quantity: 1,
          prevStock: product.currentStock,
          currentStock: updatedProduct.currentStock,
          scanner: 'Scanner-01',
          user: 'operator',
        }, ...current.transactions],
      }));

      setScannedProduct(updatedProduct);
      setState('success');
      setSimulating(false);
    }, 1800);
  };

  const reset = () => {
    setState('waiting');
    setErrorMessage('');
  };

  useEffect(() => {
    if (state === 'success' || state === 'error') {
      const tTimer = setTimeout(reset, 5000);
      return () => clearTimeout(tTimer);
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
            {t('LIVE SCAN')}
          </span>
        </div>
        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }}>
          {t('Demo Scanner')}
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
              {t('Waiting for barcode scan...')}
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
              {t('SCANNING...')}
            </p>
          </>
        )}

        {state === 'success' && (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: 'var(--success)' }}>✓</span>
              <span className="text-sm font-semibold font-display" style={{ color: 'var(--success)' }}>
                {t('Barcode Detected & Verified')}
              </span>
            </div>
            <div className="text-xs font-mono py-1.5 px-2 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
              {scannedProduct?.barcode}
            </div>
            <div className="font-semibold text-sm font-body" style={{ color: 'var(--foreground)' }}>
              {scannedProduct?.name}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(217,83,79,0.12)', color: 'var(--danger)' }}>
                {t('STOCK OUT')}
              </span>
              <span className="font-bold text-sm" style={{ color: 'var(--danger)' }}>
                -1 {scannedProduct?.unit}
              </span>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Stock: {(scannedProduct?.currentStock ?? 0) + 1} → <strong style={{ color: 'var(--foreground)' }}>{scannedProduct?.currentStock}</strong>
            </div>
          </div>
        )}

        {state === 'error' && (
          <>
            <div className="text-3xl">⚠</div>
            <p className="text-sm font-semibold font-display text-center" style={{ color: 'var(--danger)' }}>
              {errorMessage || t('Unauthorized Barcode')}
            </p>
            <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
              {t('Scanner menolak produk di luar inventaris PT.')}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => state === 'waiting' ? simulate() : reset()}
          disabled={simulating}
          className="w-full py-2.5 rounded-xl text-sm font-semibold font-body transition-all duration-200 cursor-pointer"
          style={{
            background: simulating ? 'var(--muted)' : 'var(--primary)',
            color: simulating ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
          }}
        >
          {state === 'waiting' ? `▶ ${t('Simulate Valid Scan')}` : state === 'scanning' ? t('Scanning...') : `↩ ${t('Reset')}`}
        </button>

        {/* Tombol uji coba simulasi scan barcode PALSU/ASING */}
        {state === 'waiting' && (
          <button
            onClick={() => simulate('BARCODE-PALSU-999')}
            disabled={simulating}
            className="w-full py-2 rounded-xl text-xs font-semibold font-body cursor-pointer transition-all"
            style={{
              background: 'rgba(217,83,79,0.1)',
              color: 'var(--danger)',
              border: '1px dashed var(--danger)',
            }}
          >
            🚫 {t('Simulasi Scan Barcode Asing/Palsu')}
          </button>
        )}
      </div>
    </div>
  );
}