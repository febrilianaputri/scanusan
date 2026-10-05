import { useState } from 'react';
import AuthBackground from '../../components/AuthBackground';
import type { AuthPage, AuthUser, Theme } from '../../types';

type LoginState = 'default' | 'loading' | 'error' | 'success';

interface LoginProps {
  theme: Theme;
  onThemeToggle: () => void;
  onNavigate: (page: AuthPage) => void;
  onLogin: (user: AuthUser, remember: boolean) => void;
}

const DEMO_ADMIN: AuthUser = {
  id: 'u1', name: 'Ahmad Rizki', email: 'admin@kami.inv',
  role: 'admin', phone: '+62 812 3456 7890', position: 'System Administrator', department: 'IT',
};
const DEMO_OPERATOR: AuthUser = {
  id: 'u2', name: 'Siti Rahayu', email: 'operator@kami.inv',
  role: 'operator', phone: '+62 813 9876 5432', position: 'Warehouse Operator', department: 'Operations',
};

export default function Login({ theme, onThemeToggle, onNavigate, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [state, setState] = useState<LoginState>('default');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setErrorMsg('Please fill in all fields.'); setState('error'); return; }
    setState('loading');
    setTimeout(() => {
      if (email === 'admin@kami.inv' && password === 'admin123') {
        setState('success');
        setTimeout(() => onLogin(DEMO_ADMIN, remember), 800);
      } else if (email === 'operator@kami.inv' && password === 'op123') {
        setState('success');
        setTimeout(() => onLogin(DEMO_OPERATOR, remember), 800);
      } else {
        setState('error');
        setErrorMsg('Invalid email or password.');
      }
    }, 1200);
  };

  return (
    <AuthBackground>
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-sm">
            KI
          </div>
          <div>
            <div className="font-display font-bold text-white text-lg leading-tight">KAMI Inventory</div>
            <div className="text-white/70 text-xs">Inventory Management</div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Illustration */}
          <div
            className="rounded-3xl p-8 flex flex-col items-center justify-center gap-4"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <div className="grid grid-cols-3 gap-3 opacity-80">
              {['📦','📡','🏭','↑','◎','↓','📊','⚙','📋'].map((icon, i) => (
                <div key={i} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                  {icon}
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <div className="font-display font-bold text-white text-xl">Smart Inventory Management</div>
              <div className="text-white/70 text-sm mt-1 leading-relaxed">
                Manage inventory, track stock movement, and connect your IoT barcode scanner in real time.
              </div>
            </div>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-3">
            {[
              { icon: '📡', text: 'Real-time IoT barcode scanning' },
              { icon: '📊', text: 'Live stock movement analytics' },
              { icon: '🔔', text: 'Instant low-stock alerts' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-base">{f.icon}</div>
                <span className="text-white/80 text-sm font-body">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/40 text-xs">© 2026 KAMI Inventory · v2.4.1</div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'var(--primary)' }}>KI</div>
          <span className="font-display font-bold text-lg text-white">KAMI Inventory</span>
        </div>

        <div className="w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-md"
          style={{ background: 'color-mix(in srgb, var(--card) 88%, transparent)', border: '1px solid var(--border)' }}>
          {/* Theme toggle */}
          <div className="flex justify-end mb-6">
            <button onClick={onThemeToggle}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-body"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
              {theme === 'light' ? '🌙 Dark' : '☀ Light'}
            </button>
          </div>

          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--foreground)' }}>
            Welcome Back
          </h1>
          <p className="text-sm font-body mb-7" style={{ color: 'var(--muted-foreground)' }}>
            Sign in to your inventory dashboard
          </p>

          {/* Demo hint */}
          <div className="rounded-xl p-3 mb-5 text-xs font-body" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
            <strong style={{ color: 'var(--foreground)' }}>Demo:</strong>
            <span style={{ color: 'var(--muted-foreground)' }}> admin@kami.inv / admin123  ·  operator@kami.inv / op123</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 font-body" style={{ color: 'var(--muted-foreground)' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setState('default'); }}
                className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                style={{
                  background: 'var(--card)',
                  border: `1px solid ${state === 'error' ? 'var(--danger)' : 'var(--border)'}`,
                  color: 'var(--foreground)',
                }}
                onFocus={(e) => { if (state !== 'error') e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={(e) => { if (state !== 'error') e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 font-body" style={{ color: 'var(--muted-foreground)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setState('default'); }}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm font-body outline-none transition-all"
                  style={{
                    background: 'var(--card)',
                    border: `1px solid ${state === 'error' ? 'var(--danger)' : 'var(--border)'}`,
                    color: 'var(--foreground)',
                  }}
                  onFocus={(e) => { if (state !== 'error') e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={(e) => { if (state !== 'error') e.target.style.borderColor = 'var(--border)'; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'var(--muted-foreground)' }}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Error */}
            {state === 'error' && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(217,83,79,0.1)', border: '1px solid rgba(217,83,79,0.3)', color: 'var(--danger)' }}>
                ⚠ {errorMsg}
              </div>
            )}

            {/* Success */}
            {state === 'success' && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(106,168,79,0.1)', border: '1px solid rgba(106,168,79,0.3)', color: 'var(--success)' }}>
                ✓ Login successful — redirecting...
              </div>
            )}

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-green-600" />
                <span className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>Remember me</span>
              </label>
              <button type="button" onClick={() => onNavigate('forgot-password')}
                className="text-xs font-semibold font-body" style={{ color: 'var(--primary)' }}>
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={state === 'loading' || state === 'success'}
              className="w-full py-3 rounded-xl text-sm font-semibold font-body transition-all"
              style={{
                background: state === 'loading' || state === 'success' ? 'var(--muted)' : 'var(--primary)',
                color: state === 'loading' || state === 'success' ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                cursor: state === 'loading' ? 'not-allowed' : 'pointer',
              }}
            >
              {state === 'loading' ? 'Signing in...' : state === 'success' ? '✓ Login successful' : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            {/* Google */}
            <button type="button" onClick={() => { setEmail('admin@kami.inv'); setPassword('admin123'); setState('default'); setErrorMsg(''); }}
              className="w-full py-3 rounded-xl text-sm font-semibold font-body flex items-center justify-center gap-2 transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--card)')}>
              <span>↳</span> Fill Demo Admin Credentials
            </button>
          </form>

          <p className="text-center text-xs font-body mt-6" style={{ color: 'var(--muted-foreground)' }}>
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')}
              className="font-semibold" style={{ color: 'var(--primary)' }}>
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
    </AuthBackground>
  );
}
