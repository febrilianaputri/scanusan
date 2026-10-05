import type { Page, UserRole } from '../types';

interface NavItem { id: Page; label: string; icon: string; roles?: UserRole[] }
interface NavSection { section: string; items: NavItem[] }

const navItems: NavSection[] = [
  {
    section: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
      { id: 'inventory', label: 'Inventory', icon: '📦' },
      { id: 'transactions', label: 'Transactions', icon: '↕' },
    ],
  },
  {
    section: 'MONITORING',
    items: [
      { id: 'iot-scanner', label: 'IoT Scanner', icon: '📡' },
      { id: 'scan-activity', label: 'Scan Activity', icon: '◎' },
      { id: 'reports', label: 'Reports', icon: '📊', roles: ['admin'] },
    ],
  },
  {
    section: 'MANAGEMENT',
    items: [
      { id: 'suppliers', label: 'Suppliers', icon: '🏭', roles: ['admin'] },
      { id: 'users', label: 'Users', icon: '👥', roles: ['admin'] },
      { id: 'settings', label: 'Settings', icon: '⚙', roles: ['admin'] },
    ],
  },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export default function Sidebar({ currentPage, onNavigate, isOpen, onClose, role }: SidebarProps) {
  const visible = (item: NavItem) => !item.roles || item.roles.includes(role);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen z-30 flex flex-col w-60 border-r transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--sidebar)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'var(--primary)' }}>KI</div>
          <div>
            <div className="font-display font-semibold text-sm leading-tight" style={{ color: 'var(--foreground)' }}>
              KAMI Inventory
            </div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Inventory Management</div>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-4 pt-3">
          <div className="rounded-lg px-3 py-1.5 flex items-center gap-2"
            style={{ background: 'var(--muted)' }}>
            <span className="text-xs">{role === 'admin' ? '⚡' : '👤'}</span>
            <span className="text-xs font-semibold font-body capitalize" style={{ color: 'var(--muted-foreground)' }}>
              {role === 'admin' ? 'Administrator' : 'Operator'}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {navItems.map((section) => {
            const visibleItems = section.items.filter(visible);
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.section} className="mb-5">
                <div className="px-3 mb-2 text-xs font-semibold tracking-widest font-body"
                  style={{ color: 'var(--muted-foreground)' }}>
                  {section.section}
                </div>
                <div className="flex flex-col gap-0.5">
                  {visibleItems.map((item) => {
                    const active = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { onNavigate(item.id); onClose(); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all duration-150"
                        style={active
                          ? { background: 'var(--primary)', color: 'var(--primary-foreground)' }
                          : { color: 'var(--secondary-foreground)' }}
                        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--muted)'; }}
                        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <span className="text-base w-5 text-center">{item.icon}</span>
                        <span className="font-body">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Scanner status */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="rounded-xl px-3 py-3 flex items-center gap-2.5" style={{ background: 'var(--muted)' }}>
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75"></div>
            </div>
            <div>
              <div className="text-xs font-semibold font-body" style={{ color: 'var(--foreground)' }}>Scanner-01</div>
              <div className="text-xs" style={{ color: 'var(--success)' }}>Online</div>
            </div>
            <button onClick={() => onNavigate('iot-scanner')} className="ml-auto text-xs px-2 py-1 rounded-md" style={{ color: 'var(--primary)' }}>
              View
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
