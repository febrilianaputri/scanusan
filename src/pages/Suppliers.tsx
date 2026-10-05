import { useState } from 'react';
import { suppliers as initialSuppliers } from '../data/mockData';

export default function Suppliers() {
  const [supps] = useState(initialSuppliers);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          + Add Supplier
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Supplier', 'Contact', 'Products', 'Last Transaction', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supps.map((s) => (
                <tr key={s.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: 'var(--muted)', color: 'var(--primary)' }}>
                        {s.name[0]}
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.contact}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{s.products}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.lastTransaction}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={s.status === 'active'
                        ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                        : { background: 'rgba(154,143,135,0.15)', color: 'var(--muted-foreground)' }}>
                      {s.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: 'var(--muted)', color: 'var(--primary)' }}>Edit</button>
                      <button className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(217,83,79,0.1)', color: 'var(--danger)' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
