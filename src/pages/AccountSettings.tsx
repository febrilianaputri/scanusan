import { useState } from 'react';
import type { AuthUser, Theme } from '../types';

interface AccountSettingsProps {
  user: AuthUser;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onUpdate: (user: AuthUser) => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <h2 className="font-display font-semibold text-sm tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{title}</h2>
    </div>
    <div className="px-6 py-4 flex flex-col gap-4">{children}</div>
  </div>
);

const Toggle = ({ label, sub, defaultOn = false }: { label: string; sub?: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-semibold font-body" style={{ color: 'var(--foreground)' }}>{label}</div>
        {sub && <div className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>{sub}</div>}
      </div>
      <button onClick={() => setOn(!on)} className="relative w-11 h-6 rounded-full transition-colors shrink-0"
        style={{ background: on ? 'var(--primary)' : 'var(--border)' }}>
        <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
          style={{ left: on ? '22px' : '2px' }} />
      </button>
    </div>
  );
};

export default function AccountSettings({ user, theme, onThemeChange, onUpdate }: AccountSettingsProps) {
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: user.phone || '', position: user.position || '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const saveProfile = () => {
    onUpdate({ ...user, ...profile });
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      <Section title="PROFILE">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ background: 'var(--primary)' }}>
            {user.name[0]}
          </div>
          <div>
            <div className="font-display font-semibold" style={{ color: 'var(--foreground)' }}>{user.name}</div>
            <div className="text-sm font-body" style={{ color: 'var(--muted-foreground)' }}>{user.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Full Name', key: 'name' as const },
            { label: 'Email', key: 'email' as const },
            { label: 'Phone', key: 'phone' as const },
            { label: 'Position', key: 'position' as const },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold mb-1.5 font-body" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
              <input value={profile[f.key]} onChange={(event) => setProfile({ ...profile, [f.key]: event.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          ))}
        </div>
        {profileSaved && <p role="status" className="text-xs" style={{ color: 'var(--success)' }}>Profile saved.</p>}
        <div className="flex justify-end">
          <button onClick={saveProfile} className="px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Save Profile
          </button>
        </div>
      </Section>

      <Section title="SECURITY">
        <h3 className="font-semibold text-sm font-body -mb-2" style={{ color: 'var(--foreground)' }}>Change Password</h3>
        <p className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>Password updates require a configured identity service; credentials are not stored by this local demo.</p>
        <div className="h-px" style={{ background: 'var(--border)' }} />
        <Toggle label="Two-Factor Authentication" sub="Add an extra layer of security to your account" />
        <div>
          <div className="text-sm font-semibold font-body mb-2" style={{ color: 'var(--foreground)' }}>Active Sessions</div>
          <div className="rounded-xl p-3 flex items-center justify-between"
            style={{ background: 'var(--muted)' }}>
            <div>
              <div className="text-xs font-semibold font-body" style={{ color: 'var(--foreground)' }}>Chrome · Windows</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Current session · Jakarta, ID</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }}>Active</span>
          </div>
        </div>
      </Section>

      <Section title="NOTIFICATIONS">
        <Toggle label="Email Notifications" sub="Receive activity summaries by email" defaultOn />
        <Toggle label="Low Stock Alerts" sub="Get alerted when products fall below minimum" defaultOn />
        <Toggle label="Scanner Offline Alerts" sub="Notify when a scanner goes offline" defaultOn />
        <Toggle label="Transaction Notifications" sub="Notify on every stock movement" />
      </Section>

      <Section title="APPEARANCE">
        <div>
          <div className="text-xs font-semibold mb-2 font-body" style={{ color: 'var(--muted-foreground)' }}>Theme</div>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark'] as const).map((t) => (
              <button key={t} onClick={() => onThemeChange(t)}
                className="py-3 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold font-body transition-all"
                style={theme === t
                  ? { background: t === theme ? 'var(--primary)' : 'var(--muted)', color: t === theme ? 'var(--primary-foreground)' : 'var(--foreground)', border: `2px solid ${t === theme ? 'var(--primary)' : 'var(--border)'}` }
                  : { background: 'var(--muted)', color: 'var(--foreground)', border: '2px solid var(--border)' }}>
                <span className="text-lg">{t === 'light' ? '☀' : t === 'dark' ? '🌙' : '◐'}</span>
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(217,83,79,0.3)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(217,83,79,0.3)', background: 'rgba(217,83,79,0.05)' }}>
          <h2 className="font-display font-semibold text-sm" style={{ color: 'var(--danger)' }}>DANGER ZONE</h2>
        </div>
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--card)' }}>
          <div>
            <div className="font-semibold text-sm font-body" style={{ color: 'var(--foreground)' }}>Delete Account</div>
            <div className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>
              Account deletion requires a configured identity service and is unavailable in this local demo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
