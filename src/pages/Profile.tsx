import { useState } from 'react';
import type { AuthUser } from '../types';

interface ProfileProps {
  user: AuthUser;
  onUpdate: (u: AuthUser) => void;
}

const activity = [
  { time: '10:32', action: 'Stock Out — CAT6 Cable' },
  { time: '09:45', action: 'Updated product — RJ45 Connector' },
  { time: '09:12', action: 'Stock In — Fiber Optic Patch' },
  { time: 'Yesterday', action: 'Logged in' },
  { time: 'Yesterday', action: 'Generated report — Stock Movement' },
];

export default function Profile({ user, onUpdate }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onUpdate(form);
      setSaving(false);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const InfoRow = ({ label, value, field }: { label: string; value?: string; field: keyof typeof form }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold font-body" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      {editing ? (
        <input
          value={form[field] as string || ''}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="px-3 py-2.5 rounded-xl text-sm font-body outline-none"
          style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      ) : (
        <div className="text-sm font-body py-1" style={{ color: 'var(--foreground)' }}>{value || '—'}</div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl flex flex-col gap-4">
      {saved && (
        <div className="rounded-xl px-4 py-3 text-sm font-body"
          style={{ background: 'rgba(106,168,79,0.1)', border: '1px solid rgba(106,168,79,0.3)', color: 'var(--success)' }}>
          ✓ Profile updated successfully
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <div className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ background: 'var(--primary)' }}>
              {user.name[0]}
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--primary)' }}>
                ✏
              </button>
            )}
          </div>
          <div>
            <div className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>{user.name}</div>
            <div className="text-sm font-body" style={{ color: 'var(--muted-foreground)' }}>{user.email}</div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-center">
              <span className="text-xs px-3 py-1 rounded-full font-semibold"
                style={user.role === 'admin'
                  ? { background: 'color-mix(in srgb, var(--primary) 15%, transparent)', color: 'var(--primary)' }
                  : { background: 'rgba(141,110,99,0.15)', color: 'var(--brown)' }}>
                {user.role === 'admin' ? '⚡ Administrator' : '👤 Operator'}
              </span>
            </div>
            <div className="flex justify-center">
              <span className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{ background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }}>
                🟢 Active
              </span>
            </div>
          </div>
        </div>

        {/* Info + activity */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Personal info */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-base" style={{ color: 'var(--foreground)' }}>
                Personal Information
              </h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold font-body"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--primary)' }}>
                  ✏ Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); setForm({ ...user }); }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold font-body"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="px-3 py-2 rounded-xl text-xs font-semibold font-body"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={user.name} field="name" />
              <InfoRow label="Email Address" value={user.email} field="email" />
              <InfoRow label="Phone Number" value={user.phone} field="phone" />
              <InfoRow label="Position" value={user.position} field="position" />
              <InfoRow label="Department" value={user.department} field="department" />
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--foreground)' }}>
              Recent Activity
            </h2>
            <div className="flex flex-col gap-2">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--primary)' }} />
                  <div className="flex-1">
                    <div className="text-sm font-body" style={{ color: 'var(--foreground)' }}>{a.action}</div>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
