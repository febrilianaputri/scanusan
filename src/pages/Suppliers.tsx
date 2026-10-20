import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';
import type { Supplier } from '../types';
import { useLanguage } from '../i18n';

interface SupplierModalProps {
  onClose: () => void;
  onSave: (supplierData: { name: string; contact: string; status: 'active' | 'inactive' }) => void;
  supplier?: Supplier | null;
}

function SupplierModal({ onClose, onSave, supplier }: SupplierModalProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: supplier ? supplier.name : '',
    contact: supplier ? supplier.contact : '',
    status: supplier ? supplier.status : ('active' as const),
  });

  const handleSave = () => {
    if (!form.name.trim() || !form.contact.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-2xl w-full max-w-md overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--foreground)' }}>
            {t(supplier ? 'Edit Supplier' : 'Add Supplier')}
          </h2>
          <button onClick={onClose} className="text-lg" style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>
        <div className="px-6 py-4 flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
              {t('Supplier name')}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none transition-all"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
              {t('Contact email or phone')}
            </label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none transition-all"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
              {t('Status')}
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="active">{t('Active')}</option>
              <option value="inactive">{t('Inactive')}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            {t('Cancel')}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {t(supplier ? 'Save Changes' : 'Save Supplier')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Suppliers() {
  const { t } = useLanguage();
  const { data, setData } = useAppData();
  const supps = data.suppliers;

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const handleSaveSupplier = (supplierData: { name: string; contact: string; status: 'active' | 'inactive' }) => {
    if (editingSupplier) {
      // Edit mode
      setData((current) => ({
        ...current,
        suppliers: current.suppliers.map((item) =>
          item.id === editingSupplier.id ? { ...item, ...supplierData } : item
        ),
      }));
    } else {
      // Add mode
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        name: supplierData.name,
        contact: supplierData.contact,
        products: 0,
        lastTransaction: t('No transactions yet'),
        status: supplierData.status,
      };
      setData((current) => ({ ...current, suppliers: [...current.suppliers, newSupplier] }));
    }
    setEditingSupplier(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => { setEditingSupplier(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          + {t('Add Supplier')}
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Supplier', 'Contact', 'Products', 'Last Transaction', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    {t(h)}
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
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>
                    {data.products.filter((product) => product.supplier === s.name).length}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.lastTransaction}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={s.status === 'active'
                        ? { background: 'rgba(106,168,79,0.12)', color: 'var(--success)' }
                        : { background: 'rgba(154,143,135,0.15)', color: 'var(--muted-foreground)' }}>
                      {t(s.status === 'active' ? 'Active' : 'Inactive')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingSupplier(s); setShowModal(true); }} className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: 'var(--muted)', color: 'var(--primary)' }}>{t('Edit')}</button>
                      <button onClick={() => {
                        if (window.confirm(t('Delete supplier?').replace('{name}', s.name))) {
                          setData((current) => ({ ...current, suppliers: current.suppliers.filter((item) => item.id !== s.id) }));
                        }
                      }} className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(217,83,79,0.1)', color: 'var(--danger)' }}>{t('Delete')}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={() => { setShowModal(false); setEditingSupplier(null); }}
          onSave={handleSaveSupplier}
        />
      )}
    </div>
  );
}