import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';
import type { Product } from '../types';

const categories = ['All', 'Networking', 'Accessories', 'Fiber'];

interface AddModalProps {
  onClose: () => void;
  onSave: (p: Omit<Product, 'id' | 'status'>) => void;
  product?: Product | null;
}

function AddModal({ onClose, onSave, product }: AddModalProps) {
  const [form, setForm] = useState(() => product ? {
    name: product.name, barcode: product.barcode, category: product.category, unit: product.unit,
    minStock: product.minStock, currentStock: product.currentStock, location: product.location, supplier: product.supplier,
  } : {
    name: '', barcode: '', category: 'Networking', unit: 'pcs',
    minStock: 10, currentStock: 0, location: '', supplier: '',
  });

  const handleSave = () => {
    if (!form.name || !form.barcode) return;
    onSave({ ...form });
    onClose();
  };

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none transition-all"
        style={{
          background: 'var(--muted)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--foreground)' }}>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-lg" style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>
        <div className="px-6 py-4 flex flex-col gap-3">
          {field('Product Name', 'name')}
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
              Barcode
            </label>
            <div className="flex gap-2">
              <input
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                placeholder="Type or scan barcode, then press Enter"
                className="flex-1 px-3 py-2.5 rounded-xl text-sm font-body outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              A connected scanner can type directly into this field.
            </p>
          </div>
          {field('Category', 'category')}
          {field('Unit', 'unit')}
          {field('Minimum Stock', 'minStock', 'number')}
          {field('Initial Stock', 'currentStock', 'number')}
          {field('Location', 'location')}
          {field('Supplier', 'supplier')}
        </div>
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-body"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {product ? 'Save Changes' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

const statusConfig = {
  good: { label: 'Good', bg: 'rgba(106,168,79,0.12)', color: 'var(--success)' },
  low: { label: 'Low Stock', bg: 'rgba(233,180,76,0.12)', color: 'var(--warning)' },
  out: { label: 'Out of Stock', bg: 'rgba(217,83,79,0.12)', color: 'var(--danger)' },
};

export default function Inventory() {
  const { data, setData } = useAppData();
  const prods = data.products;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const filtered = prods.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchCat = category === 'All' || p.category === category;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase().replace(' ', '');
    return matchSearch && matchCat && matchStatus;
  });

  const handleAdd = (data: Omit<Product, 'id' | 'status'>) => {
    const status: Product['status'] = data.currentStock === 0 ? 'out' : data.currentStock < data.minStock ? 'low' : 'good';
    setData((current) => ({ ...current, products: [...current.products, { ...data, id: String(Date.now()), status }] }));
  };

  const handleSave = (productData: Omit<Product, 'id' | 'status'>) => {
    const status: Product['status'] = productData.currentStock === 0 ? 'out' : productData.currentStock < productData.minStock ? 'low' : 'good';
    if (editing) {
      setData((current) => ({
        ...current,
        products: current.products.map((product) => product.id === editing.id ? { ...productData, id: product.id, status } : product),
      }));
      setEditing(null);
      return;
    }
    handleAdd(productData);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span style={{ color: 'var(--muted-foreground)' }}>🔍</span>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm font-body w-36"
              style={{ color: 'var(--foreground)' }}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-body outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-body outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            {['All', 'Good', 'Low', 'Out'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Product', 'Barcode', 'Category', 'Current Stock', 'Min Stock', 'Status', 'Location', 'Supplier', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const s = statusConfig[p.status];
                return (
                  <tr
                    key={p.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      {p.barcode}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.category}</td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                      {p.currentStock} {p.unit}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.minStock}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.location}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.supplier}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(p); setShowModal(true); }} className="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                          style={{ background: 'var(--muted)', color: 'var(--primary)' }}>Edit</button>
                        <button onClick={() => {
                          if (window.confirm(`Delete ${p.name}?`)) {
                            setData((current) => ({ ...current, products: current.products.filter((product) => product.id !== p.id) }));
                          }
                        }} className="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                          style={{ background: 'rgba(217,83,79,0.1)', color: 'var(--danger)' }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Showing {filtered.length} of {prods.length} products
          </span>
        </div>
      </div>

      {showModal && <AddModal product={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
