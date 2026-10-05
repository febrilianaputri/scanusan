import { useState } from 'react';
import AuthBackground from '../../components/AuthBackground';
import type { AuthPage, AuthUser, Theme } from '../../types';

type RegState = 'default' | 'loading' | 'error' | 'success';

interface RegisterProps {
  theme: Theme;
  onThemeToggle: () => void;
  onNavigate: (page: AuthPage) => void;
  onRegister: (user: AuthUser) => void;
}

function passwordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: '', color: 'var(--border)', width: '0%' };
  if (pw.length < 6) return { label: 'Weak', color: 'var(--danger)', width: '30%' };
  if (pw.length < 10 || !/[0-9]/.test(pw)) return { label: 'Medium', color: 'var(--warning)', width: '60%' };
  return { label: 'Strong', color: 'var(--success)', width: '100%' };
}

export default function Register({ theme, onThemeToggle, onNavigate, onRegister }: RegisterProps) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<RegState>('default');
  const [errors, setErrors] = useState<Partial<typeof form & { agree: string }>>({});

  const strength = passwordStrength(form.password);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name) e.name = 'Full name is required.';
    if (!form.email.includes('@')) e.email = 'Enter a valid email address.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
    if (!agreed) e.agree = 'You must agree to the terms.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); setState('error'); return; }
    setState('loading');
    setTimeout(() => {
      setState('success');
      onRegister({
        id: `u-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: 'operator',
      });
    }, 500);
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type: string = 'text',
    extra?: React.ReactNode,
  ) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5 font-body" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={form[key]}
          onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: undefined }); }}
          className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
          style={{
            background: 'var(--card)',
            border: `1px solid ${errors[key] ? 'var(--danger)' : 'var(--border)'}`,
            color: 'var(--foreground)',
            paddingRight: extra ? '44px' : undefined,
          }}
          onFocus={(e) => { if (!errors[key]) e.target.style.borderColor = 'var(--primary)'; }}
          onBlur={(e) => { if (!errors[key]) e.target.style.borderColor = 'var(--border)'; }}
        />
        {extra && <div className="absolute right-3 top-1/2 -translate-y-1/2">{extra}</div>}
      </div>
      {errors[key] && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors[key]}</p>}
    </div>
  );

  if (state === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'rgba(106,168,79,0.15)' }}>✓</div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--foreground)' }}>
            Account created successfully
          </h1>
          <p className="text-sm font-body" style={{ color: 'var(--muted-foreground)' }}>Redirecting to dashboard...</p>
          <button onClick={() => onNavigate('login')}
            className="px-6 py-3 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthBackground>
    <div className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'var(--primary)' }}>KI</div>
            <span className="font-display font-bold text-base text-white">KAMI Inventory</span>
          </div>
          <button onClick={onThemeToggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-body"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
            {theme === 'light' ? '🌙 Dark' : '☀ Light'}
          </button>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl backdrop-blur-md"
          style={{ background: 'color-mix(in srgb, var(--card) 88%, transparent)', border: '1px solid var(--border)' }}>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--foreground)' }}>Create Account</h1>
          <p className="text-sm font-body mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Create your account to manage your inventory.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {field('Full Name', 'name')}
            {field('Email Address', 'email', 'email')}
            {field('Password', 'password', showPw ? 'text' : 'password',
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {showPw ? '🙈' : '👁'}
              </button>
            )}

            {/* Strength indicator */}
            {form.password.length > 0 && (
              <div className="-mt-2">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }} />
                </div>
                <p className="text-xs mt-1 font-semibold font-body" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </div>
            )}

            {field('Confirm Password', 'confirm', showConfirm ? 'text' : 'password',
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {showConfirm ? '🙈' : '👁'}
              </button>
            )}

            {/* Agree */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <div onClick={() => setAgreed(!agreed)}
                  className="w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center"
                  style={{
                    background: agreed ? 'var(--primary)' : 'var(--card)',
                    border: `1px solid ${errors.agree ? 'var(--danger)' : agreed ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                  {agreed && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-xs font-body leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  I agree to the{' '}
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>Privacy Policy</span>
                </span>
              </label>
              {errors.agree && <p className="text-xs mt-1 ml-6" style={{ color: 'var(--danger)' }}>{errors.agree}</p>}
            </div>

            <button type="submit" disabled={state === 'loading'}
              className="w-full py-3 rounded-xl text-sm font-semibold font-body mt-1"
              style={{
                background: state === 'loading' ? 'var(--muted)' : 'var(--primary)',
                color: state === 'loading' ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
              }}>
              {state === 'loading' ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-body mt-4 text-white/80">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-semibold" style={{ color: 'var(--primary)' }}>
            Sign In
          </button>
        </p>
      </div>
    </div>
    </AuthBackground>
  );
}
