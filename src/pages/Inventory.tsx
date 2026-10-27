import { useState, useMemo } from 'react';
import { useAppData } from '../data/AppDataContext';
import type { Product } from '../types';
import { useLanguage } from '../i18n';

interface AddModalProps {
  onClose: () => void;
  onSave: (p: Omit<Product, 'id' | 'status'>) => void;
  product?: Product | null;
  existingCategories: string[];
}

function AddModal({ onClose, onSave, product, existingCategories }: AddModalProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState(() => product ? {
    name: product.name, barcode: product.barcode, category: product.category, unit: product.unit || 'pcs',
    minStock: product.minStock, currentStock: product.currentStock, location: product.location, supplier: product.supplier,
  } : {
    name: '', barcode: '', category: existingCategories[0] || 'Networking', unit: 'pcs',
    minStock: 10, currentStock: 0, location: '', supplier: '',
  });

  // State untuk menangani mode input kategori baru
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const handleSave = () => {
    if (!form.name || !form.barcode) return;
    const finalCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : form.category;
    onSave({ ...form, category: finalCategory });
    onClose();
  };

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
        {t(label)}
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
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--foreground)' }}>{t(product ? 'Edit Product' : 'Add New Product')}</h2>
          <button onClick={onClose} className="text-lg" style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>
        <div className="px-6 py-4 flex flex-col gap-3">
          {field('Product Name', 'name')}
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
              {t('Barcode')}
            </label>
            <div className="flex gap-2">
              <input
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                placeholder={t('Type or scan barcode, then press Enter')}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm font-body outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {t('A connected scanner can type directly into this field.')}
            </p>
          </div>
          
          {/* Category Dropdown dengan Opsi Tambah Baru */}
          <div>
            <label className="block text-xs font-semibold mb-1 font-body" style={{ color: 'var(--muted-foreground)' }}>
              {t('Category')}
            </label>
            <select
              value={isCustomCategory ? '__NEW__' : form.category}
              onChange={(e) => {
                if (e.target.value === '__NEW__') {
                  setIsCustomCategory(true);
                } else {
                  setIsCustomCategory(false);
                  setForm({ ...form, category: e.target.value });
                }
              }}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-body outline-none"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__NEW__"> {t('+ Add New Category')}</option>
            </select>

            {isCustomCategory && (
              <input
                type="text"
                placeholder={t('Enter new category name...')}
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full mt-2 px-3 py-2.5 rounded-xl text-sm font-body outline-none"
                style={{ background: 'var(--muted)', border: '1px solid var(--primary)', color: 'var(--foreground)' }}
                autoFocus
              />
            )}
          </div>

          {field('Unit', 'unit')}
          {field('Minimum Stock', 'minStock', 'number')}
          {field('Current Stock', 'currentStock', 'number')} 
          {field('Location', 'location')}
          {field('Supplier', 'supplier')}
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
            {t(product ? 'Save Changes' : 'Save Product')}
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
  const { t } = useLanguage();
  const { data, setData } = useAppData();
  const prods = data.products;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // Kategori Dinamis & Case-Insensitive
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    prods.forEach((p) => {
      if (p.category && p.category.trim() !== '') {
        const lower = p.category.toLowerCase().trim();
        if (!map.has(lower)) {
          map.set(lower, p.category.trim());
        }
      }
    });
    return ['All', ...Array.from(map.values())];
  }, [prods]);

  const modalCategories = useMemo(() => {
    return categories.filter(c => c !== 'All');
  }, [categories]);

  const filtered = prods.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    const matchCat = category === 'All' || (p.category && p.category.toLowerCase().trim() === category.toLowerCase().trim());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase().replace(' ', '');
    return matchSearch && matchCat && matchStatus;
  });

  const handleAdd = (productData: Omit<Product, 'id' | 'status'>) => {
    const status: Product['status'] = productData.currentStock === 0 ? 'out' : productData.currentStock < productData.minStock ? 'low' : 'good';
    setData((current) => ({ ...current, products: [...current.products, { ...productData, id: String(Date.now()), status }] }));
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
              placeholder={t('Search products...')}
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
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-body outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            {['All', 'Good', 'Low', 'Out'].map((s) => <option key={s} value={s}>{t(s)}</option>)}
          </select>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          + {t('Add Product')}
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
                    {t(h)}
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
                        {t(s.label)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.location}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.supplier}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(p); setShowModal(true); }} className="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                          style={{ background: 'var(--muted)', color: 'var(--primary)' }}>{t('Edit')}</button>
                        <button onClick={() => {
                          if (window.confirm(t('Delete product?').replace('{name}', p.name))) {
                            setData((current) => ({ ...current, products: current.products.filter((product) => product.id !== p.id) }));
                          }
                        }} className="px-2 py-1 rounded-lg text-xs font-semibold transition-colors"
                          style={{ background: 'rgba(217,83,79,0.1)', color: 'var(--danger)' }}>{t('Delete')}</button>
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
            {t('Showing')} {filtered.length} {t('of')} {prods.length} {t('products')}
          </span>
        </div>
      </div>

      {showModal && (
        <AddModal
          product={editing}
          existingCategories={modalCategories.length > 0 ? modalCategories : ['Networking', 'General']}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}