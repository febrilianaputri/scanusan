import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAppData } from '../data/AppDataContext';

export default function Reports() {
  const { data } = useAppData();
  const chartData = data.transactions.slice(0, 7).reverse().map((transaction) => ({
    day: transaction.time,
    in: transaction.type === 'in' ? transaction.quantity : 0,
    out: transaction.type === 'out' ? transaction.quantity : 0,
  }));
  const totalIn = data.transactions.filter((transaction) => transaction.type === 'in').reduce((sum, transaction) => sum + transaction.quantity, 0);
  const totalOut = data.transactions.filter((transaction) => transaction.type === 'out').reduce((sum, transaction) => sum + transaction.quantity, 0);
  const movements = data.products.map((product) => ({
    product,
    quantity: data.transactions.filter((transaction) => transaction.barcode === product.barcode).reduce((sum, transaction) => sum + transaction.quantity, 0),
  })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const maxMovement = Math.max(1, ...movements.map((item) => item.quantity));

  const exportReport = () => {
    const rows = [
      ['Time', 'Barcode', 'Product', 'Type', 'Quantity', 'Previous Stock', 'Current Stock', 'Scanner', 'User'],
      ...data.transactions.map((transaction) => [
        transaction.time, transaction.barcode, transaction.product, transaction.type,
        String(transaction.quantity), String(transaction.prevStock), String(transaction.currentStock),
        transaction.scanner, transaction.user,
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kami-inventory-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>All recorded activity · {data.transactions.length} transactions</span>
        <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          ↓ Export Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Stock In', value: String(totalIn), icon: '↑', color: 'var(--success)' },
          { label: 'Total Stock Out', value: String(totalOut), icon: '↓', color: 'var(--danger)' },
          { label: 'Net Movement', value: `${totalIn - totalOut > 0 ? '+' : ''}${totalIn - totalOut}`, icon: '≡', color: 'var(--info)' },
          { label: 'Total Transactions', value: String(data.transactions.length), icon: '◎', color: 'var(--primary)' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg" style={{ color: s.color }}>{s.icon}</span>
              <span className="text-xs font-body" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
            </div>
            <div className="font-display font-bold text-2xl" style={{ color: 'var(--foreground)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--foreground)' }}>
          Stock In vs Stock Out
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--foreground)', fontSize: '12px',
            }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--muted-foreground)' }} />
            <Bar dataKey="in" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Stock In" />
            <Bar dataKey="out" fill="#D9534F" radius={[4, 4, 0, 0]} name="Stock Out" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top products */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--foreground)' }}>
          Top Moving Products
        </h2>
        <div className="flex flex-col gap-3">
          {movements.map(({ product, quantity }, i) => {
            return (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-xs font-mono w-5 text-right" style={{ color: 'var(--muted-foreground)' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold font-body truncate" style={{ color: 'var(--foreground)' }}>
                      {product.name}
                    </span>
                    <span className="text-xs font-mono ml-2" style={{ color: 'var(--muted-foreground)' }}>
                      {quantity} moved
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(quantity / maxMovement) * 100}%`, background: 'var(--primary)' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
