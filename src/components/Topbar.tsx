import { useState, useRef, useEffect } from 'react';
import type { Theme, Page, AuthUser } from '../types';
import { useAppData } from '../data/AppDataContext';

const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your inventory and scanner activity' },
  inventory: { title: 'Inventory', subtitle: 'Manage products and current stock levels' },
  transactions: { title: 'Transactions', subtitle: 'Track every inventory movement' },
  'stock-transaction': { title: 'Stock Transaction', subtitle: 'Scan and process inventory movements' },
  'iot-scanner': { title: 'IoT Scanner', subtitle: 'Monitor connected barcode scanning devices' },
  'scan-activity': { title: 'Scan Activity', subtitle: 'Real-time barcode scan log' },
  reports: { title: 'Reports', subtitle: 'Inventory activity overview' },
  suppliers: { title: 'Suppliers', subtitle: 'Manage supplier relationships' },
  users: { title: 'Users', subtitle: 'Manage system users and roles' },
  settings: { title: 'Settings', subtitle: 'System configuration and preferences' },
  profile: { title: 'My Profile', subtitle: 'Manage your personal information' },
  'account-settings': { title: 'Account Settings', subtitle: 'Preferences, security, and notifications' },
};

interface TopbarProps {
  theme: Theme;
  onThemeToggle: () => void;
  currentPage: Page;
  onMenuToggle: () => void;
  user: AuthUser;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-2xl p-7 w-full max-w-xs flex flex-col gap-4 text-center"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto"
          style={{ background: 'var(--muted)' }}>🚪</div>
        <div>
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>Sign out?</h2>
          <p className="text-sm font-body mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Are you sure you want to sign out of your account?
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--danger)', color: '#fff' }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Topbar({ theme, onThemeToggle, currentPage, onMenuToggle, user, onNavigate, onLogout }: TopbarProps) {
  const { data } = useAppData();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { title, subtitle } = pageTitles[currentPage];
  const notifications = data.products
    .filter((product) => product.status === 'low' || product.status === 'out')
    .map((product) => ({
      msg: product.currentStock === 0
        ? `${product.name} is out of stock`
        : `${product.name} stock is low (${product.currentStock} ${product.unit})`,
      color: product.currentStock === 0 ? 'var(--danger)' : 'var(--warning)',
    }));
  const searchResults = searchQuery.trim()
    ? Object.entries(pageTitles).filter(([, page]) => `${page.title} ${page.subtitle}`.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];

  const navigateToSearchResult = (page: string) => {
    onNavigate(page as Page);
    setSearchQuery('');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 right-0 left-0 lg:left-60 h-[70px] z-10 flex items-center px-6 gap-4"
        style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}
      >
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--foreground)' }}>☰</button>

        <div className="hidden lg:block">
          <h1 className="font-display font-semibold text-lg leading-tight" style={{ color: 'var(--foreground)' }}>{title}</h1>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{subtitle}</p>
        </div>
        <div className="lg:hidden">
          <h1 className="font-display font-semibold text-base" style={{ color: 'var(--foreground)' }}>{title}</h1>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:block relative w-52">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>🔍</span>
            <input
              placeholder="Find a page..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter' && searchResults[0]) navigateToSearchResult(searchResults[0][0]); }}
              className="bg-transparent outline-none w-full text-sm font-body"
              style={{ color: 'var(--foreground)' }}
              aria-label="Search pages"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-11 left-0 right-0 rounded-xl shadow-lg z-50 overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {searchResults.map(([page, details]) => (
                <button key={page} onClick={() => navigateToSearchResult(page)}
                  className="block w-full text-left px-3 py-2.5 text-sm font-body"
                  style={{ color: 'var(--foreground)', borderBottom: '1px solid var(--border)' }}>
                  <span className="block font-semibold">{details.title}</span>
                  <span className="block text-xs" style={{ color: 'var(--muted-foreground)' }}>{details.subtitle}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme */}
        <button onClick={onThemeToggle}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-body"
          style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
          <span>{theme === 'light' ? '🌙' : '☀'}</span>
          <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2 rounded-lg" style={{ color: 'var(--foreground)' }}>
            🔔
            {notifications.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ background: 'var(--danger)', fontSize: '9px' }}>{notifications.length}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-72 rounded-xl shadow-lg z-50 overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="font-display font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Notifications</span>
              </div>
              {notifications.length === 0 && <p className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>No active inventory alerts.</p>}
              {notifications.map((n) => (
                <button key={n.msg} onClick={() => { onNavigate('inventory'); setShowNotif(false); }} className="w-full text-left px-4 py-3 flex gap-3 items-start" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.color }} />
                  <div>
                    <p className="text-xs font-body" style={{ color: 'var(--foreground)' }}>{n.msg}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Open inventory</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-colors"
            style={{ background: showProfile ? 'var(--muted)' : 'transparent' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ background: 'var(--primary)' }}>
              {user.name[0]}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold font-body" style={{ color: 'var(--foreground)' }}>{user.name.split(' ')[0]}</div>
              <div className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>{user.role}</div>
            </div>
            <span className="hidden sm:inline text-xs" style={{ color: 'var(--muted-foreground)' }}>▾</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 w-60 rounded-xl shadow-lg z-50 overflow-hidden"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              {/* User info */}
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ background: 'var(--primary)' }}>{user.name[0]}</div>
                  <div>
                    <div className="text-sm font-semibold font-body" style={{ color: 'var(--foreground)' }}>{user.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{user.email}</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ borderBottom: '1px solid var(--border)' }}>
                {[
                  { icon: '👤', label: 'My Profile', page: 'profile' as Page },
                  { icon: '⚙', label: 'Account Settings', page: 'account-settings' as Page },
                  { icon: '🔔', label: 'Notifications', page: 'account-settings' as Page },
                ].map((item) => (
                  <button key={item.label}
                    onClick={() => { onNavigate(item.page); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-left transition-colors"
                    style={{ color: 'var(--foreground)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <button
                onClick={() => { setShowProfile(false); setShowLogout(true); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-left transition-colors"
                style={{ color: 'var(--danger)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(217,83,79,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {showLogout && (
        <LogoutModal
          onConfirm={() => { setShowLogout(false); onLogout(); }}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
}
