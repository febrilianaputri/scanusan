import { useAppData } from '../data/AppDataContext';
import type { User } from '../types';

export default function Users() {
  const { data, setData } = useAppData();

  const addUser = () => {
    const name = window.prompt('User name')?.trim();
    if (!name) return;
    const email = window.prompt('User email')?.trim();
    if (!email || !email.includes('@')) return;
    const role = window.prompt('Role: admin or operator', 'operator')?.trim().toLowerCase();
    if (role !== 'admin' && role !== 'operator') return;
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      status: 'active',
      lastActivity: 'Just added',
    };
    setData((current) => ({ ...current, users: [...current.users, user] }));
  };

  const editUser = (user: User) => {
    const role = window.prompt('Role: admin or operator', user.role)?.trim().toLowerCase();
    if (role !== 'admin' && role !== 'operator') return;
    setData((current) => ({
      ...current,
      users: current.users.map((item) => item.id === user.id ? { ...item, role } : item),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={addUser} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          + Add User
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['User', 'Email', 'Role', 'Status', 'Last Activity', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'var(--primary)' }}>
                        {u.name[0]}
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={u.role === 'admin'
                        ? { background: 'color-mix(in srgb, var(--primary) 15%, transparent)', color: 'var(--primary)' }
                        : { background: 'rgba(141,110,99,0.15)', color: 'var(--brown)' }}>
                      {u.role === 'admin' ? '⚡ Admin' : '👤 Operator'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={u.status === 'active'
                        ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                        : { background: 'rgba(154,143,135,0.15)', color: 'var(--muted-foreground)' }}>
                      {u.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.lastActivity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => editUser(u)} className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: 'var(--muted)', color: 'var(--primary)' }}>Edit</button>
                      <button onClick={() => {
                        if (u.id === 'u1') return;
                        if (window.confirm(`Delete ${u.name}?`)) {
                          setData((current) => ({ ...current, users: current.users.filter((item) => item.id !== u.id) }));
                        }
                      }} className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(217,83,79,0.1)', color: 'var(--danger)' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { role: 'Admin', icon: '⚡', desc: 'Full system access — products, transactions, scanners, users, settings', color: 'var(--primary)' },
          { role: 'Operator', icon: '👤', desc: 'Inventory and transaction access — scan, stock in/out, view reports', color: 'var(--brown)' },
        ].map((r) => (
          <div key={r.role} className="rounded-2xl p-4 flex gap-3"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <span className="text-xl">{r.icon}</span>
            <div>
              <div className="font-display font-semibold text-sm" style={{ color: r.color }}>{r.role}</div>
              <div className="text-xs font-body mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
