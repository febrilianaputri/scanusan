import { useState } from 'react';
import type { Theme } from '../types';

interface SettingsProps {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <h2 className="font-display font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{title}</h2>
    </div>
    <div className="px-6 py-4 flex flex-col gap-4">{children}</div>
  </div>
);

const Field = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold font-body" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="px-3 py-2.5 rounded-xl text-sm font-body outline-none"
      style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  </div>
);

export default function Settings({ theme, onThemeChange }: SettingsProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const defaults = {
      company: 'KAMI Inventory', warehouse: 'Main Warehouse', timezone: 'Asia/Jakarta (WIB)',
      unit: 'pcs', threshold: '10', timeout: '30', endpoint: 'http://scanner-api.local/v1',
    };
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem('kami-inventory-settings') || '{}') };
    } catch {
      return defaults;
    }
  });
  const [stockAlert, setStockAlert] = useState(true);
  const [saved, setSaved] = useState(false);
  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const save = () => {
    try {
      localStorage.setItem('kami-inventory-settings', JSON.stringify({ ...values, stockAlert, theme }));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <Section title="GENERAL">
        <Field label="Company Name" value={values.company} onChange={(value) => update('company', value)} />
        <Field label="Warehouse Name" value={values.warehouse} onChange={(value) => update('warehouse', value)} />
        <Field label="Timezone" value={values.timezone} onChange={(value) => update('timezone', value)} />
      </Section>

      <Section title="INVENTORY">
        <Field label="Default Unit" value={values.unit} onChange={(value) => update('unit', value)} />
        <Field label="Low Stock Threshold" value={values.threshold} onChange={(value) => update('threshold', value)} type="number" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold font-body" style={{ color: 'var(--foreground)' }}>Stock Alert</div>
            <div className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>Send notifications when stock is low</div>
          </div>
          <button type="button" role="switch" aria-checked={stockAlert} aria-label="Stock alert" onClick={() => setStockAlert(!stockAlert)} className="relative cursor-pointer">
            <div className="w-12 h-6 rounded-full" style={{ background: stockAlert ? 'var(--primary)' : 'var(--border)' }}>
              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow transition-all" style={{ left: stockAlert ? '26px' : '2px' }} />
            </div>
          </button>
        </div>
      </Section>

      <Section title="SCANNER">
        <div className="rounded-xl p-4" style={{ background: 'var(--muted)' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75"></div>
            </div>
            <div>
              <div className="font-semibold text-sm font-body" style={{ color: 'var(--foreground)' }}>Scanner-01</div>
              <div className="text-xs" style={{ color: 'var(--success)' }}>Connected • 192.168.1.101</div>
            </div>
          </div>
        </div>
        <Field label="Scanner Timeout (seconds)" value={values.timeout} onChange={(value) => update('timeout', value)} type="number" />
        <Field label="API Endpoint" value={values.endpoint} onChange={(value) => update('endpoint', value)} />
      </Section>

      <Section title="APPEARANCE">
        <div>
          <div className="text-xs font-semibold mb-2 font-body" style={{ color: 'var(--muted-foreground)' }}>Theme</div>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className="py-3 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold font-body transition-all"
                style={theme === t
                  ? { background: 'var(--primary)', color: 'var(--primary-foreground)', border: '2px solid var(--primary)' }
                  : { background: 'var(--muted)', color: 'var(--foreground)', border: '2px solid var(--border)' }}
              >
                <span className="text-lg">{t === 'light' ? '☀' : t === 'dark' ? '🌙' : '◐'}</span>
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        {saved && <span role="status" className="self-center mr-3 text-sm" style={{ color: 'var(--success)' }}>Settings saved on this device</span>}
        <button onClick={save} className="px-6 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
