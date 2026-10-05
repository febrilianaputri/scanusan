import { useState } from 'react';
import type { AuthPage, Theme } from '../../types';

interface ForgotPasswordProps {
  theme: Theme;
  onThemeToggle: () => void;
  onNavigate: (page: AuthPage) => void;
}

export default function ForgotPassword({ theme, onThemeToggle, onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'var(--primary)' }}>KI</div>
            <span className="font-display font-bold text-base" style={{ color: 'var(--foreground)' }}>KAMI Inventory</span>
          </div>
          <button onClick={onThemeToggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-body"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
            {theme === 'light' ? '🌙 Dark' : '☀ Light'}
          </button>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {!sent ? (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)' }}>🔑</div>
              <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--foreground)' }}>Forgot Password?</h1>
              <p className="text-sm font-body mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Enter your email address and we'll send you a password reset link.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 font-body" style={{ color: 'var(--muted-foreground)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
                <button type="submit" disabled={loading || !email}
                  className="w-full py-3 rounded-xl text-sm font-semibold font-body"
                  style={{
                    background: !email ? 'var(--muted)' : 'var(--primary)',
                    color: !email ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                  }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: 'rgba(106,168,79,0.12)' }}>✉</div>
              <h2 className="font-display font-bold text-xl" style={{ color: 'var(--foreground)' }}>Reset link sent</h2>
              <p className="text-sm font-body" style={{ color: 'var(--muted-foreground)' }}>
                Check your email at <strong style={{ color: 'var(--foreground)' }}>{email}</strong> for further instructions.
              </p>
              <div className="h-px w-full" style={{ background: 'var(--border)' }} />
              <p className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="font-semibold" style={{ color: 'var(--primary)' }}>
                  try again
                </button>.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <button onClick={() => onNavigate('login')}
            className="flex items-center gap-1.5 text-xs font-semibold font-body mx-auto"
            style={{ color: 'var(--muted-foreground)' }}>
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
