import { useState, useEffect } from 'react';
import type { Theme, Page, AuthPage, AuthUser } from './types';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import StockTransaction from './pages/StockTransaction';
import IoTScanner from './pages/IoTScanner';
import ScanActivity from './pages/ScanActivity';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [page, setPage] = useState<Page>('dashboard');
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const handleLogin = (u: AuthUser) => {
    setUser(u);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthPage('login');
  };

  const handleUserUpdate = (u: AuthUser) => setUser(u);

  // Auth flow
  if (!user) {
    const authProps = { theme, onThemeToggle: toggleTheme, onNavigate: setAuthPage };
    return (
      <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
        {authPage === 'login' && <Login {...authProps} onLogin={handleLogin} />}
        {authPage === 'register' && <Register {...authProps} />}
        {authPage === 'forgot-password' && <ForgotPassword {...authProps} />}
      </div>
    );
  }

  // user is guaranteed non-null here; cast to satisfy TS across closures
  const authedUser = user as AuthUser;

  // Dashboard shell
  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'transactions': return <Transactions />;
      case 'stock-transaction': return <StockTransaction />;
      case 'iot-scanner': return <IoTScanner />;
      case 'scan-activity': return <ScanActivity />;
      case 'reports': return <Reports />;
      case 'suppliers': return <Suppliers />;
      case 'users': return <Users />;
      case 'settings': return <Settings theme={theme} onThemeChange={setTheme} />;
      case 'profile': return <Profile user={authedUser} onUpdate={handleUserUpdate} />;
      case 'account-settings': return <AccountSettings user={authedUser} theme={theme} onThemeChange={setTheme} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={authedUser.role}
      />

      <div className="lg:pl-60">
        <Topbar
          theme={theme}
          onThemeToggle={toggleTheme}
          currentPage={page}
          onMenuToggle={() => setSidebarOpen(true)}
          user={authedUser}
          onNavigate={setPage}
          onLogout={handleLogout}
        />

        <main className="pt-[70px] min-h-screen">
          <div className="p-6 lg:p-8">{renderPage()}</div>
        </main>
      </div>

      {page !== 'stock-transaction' && (
        <button
          onClick={() => setPage('stock-transaction')}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm font-body transition-all hover:scale-105"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <span className="text-lg">📡</span>
          Stock Transaction
        </button>
      )}
    </div>
  );
}
