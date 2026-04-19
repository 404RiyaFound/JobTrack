import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = { Applied: '#3d6b68', Interviewing: '#9c7a2e', Offer: '#4a7c59', Rejected: '#a0402e' };

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#faf6f0', border: '1px solid #cec3b2', borderRadius: 6, padding: '7px 12px', fontSize: 12, fontFamily: 'var(--font-mono)', boxShadow: '0 4px 12px #2c1f0e10' }}>
      <p style={{ color: 'var(--text-primary)' }}>{payload[0].name}: <strong>{payload[0].value}</strong></p>
    </div>
  );
};

export function StatusPieChart({ applications }) {
  const data = ['Applied', 'Interviewing', 'Offer', 'Rejected']
    .map(s => ({ name: s, value: applications.filter(a => a.status === s).length }))
    .filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={82} innerRadius={46} paddingAngle={3}>
          {data.map(e => <Cell key={e.name} fill={COLORS[e.name]} />)}
        </Pie>
        <Tooltip content={<Tip />} />
        <Legend iconType="square" iconSize={8} formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({ applications }) {
  const map = {};
  applications.forEach(a => {
    if (!a.appliedDate) return;
    try { const m = format(parseISO(a.appliedDate), 'MMM yy'); map[m] = (map[m] || 0) + 1; } catch { }
  });
  const data = Object.entries(map).map(([month, count]) => ({ month, count })).slice(-7);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#cec3b2" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#b09e8a', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#b09e8a', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<Tip />} />
        <Bar dataKey="count" name="Applications" fill="#8b5e3c" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
