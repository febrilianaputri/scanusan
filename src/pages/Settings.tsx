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

const Field = ({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold font-body" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      className="px-3 py-2.5 rounded-xl text-sm font-body outline-none"
      style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  </div>
);

export default function Settings({ theme, onThemeChange }: SettingsProps) {
  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <Section title="GENERAL">
        <Field label="Company Name" defaultValue="KAMI Inventory" />
        <Field label="Warehouse Name" defaultValue="Main Warehouse" />
        <Field label="Timezone" defaultValue="Asia/Jakarta (WIB)" />
      </Section>

      <Section title="INVENTORY">
        <Field label="Default Unit" defaultValue="pcs" />
        <Field label="Low Stock Threshold" defaultValue="10" type="number" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold font-body" style={{ color: 'var(--foreground)' }}>Stock Alert</div>
            <div className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>Send notifications when stock is low</div>
          </div>
          <div className="relative cursor-pointer">
            <div className="w-12 h-6 rounded-full" style={{ background: 'var(--primary)' }}>
              <div className="w-5 h-5 rounded-full bg-white absolute right-0.5 top-0.5 shadow" />
            </div>
          </div>
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
        <Field label="Scanner Timeout (seconds)" defaultValue="30" type="number" />
        <Field label="API Endpoint" defaultValue="http://scanner-api.local/v1" />
      </Section>

      <Section title="APPEARANCE">
        <div>
          <div className="text-xs font-semibold mb-2 font-body" style={{ color: 'var(--muted-foreground)' }}>Theme</div>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => t !== 'system' && onThemeChange(t)}
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
        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
