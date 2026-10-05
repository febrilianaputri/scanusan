interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
}

export default function StatCard({ icon, label, value, trend, trendUp, accent }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: accent || 'var(--muted)' }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: trendUp ? 'rgba(106,168,79,0.12)' : 'rgba(217,83,79,0.12)',
              color: trendUp ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="font-display font-bold text-3xl" style={{ color: 'var(--foreground)' }}>
          {value}
        </div>
        <div className="text-sm font-body mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
          {label}
        </div>
      </div>
    </div>
  );
}
