import { useApplicationContext } from '../../context/ApplicationContext';
import { StatusPieChart, MonthlyBarChart } from '../../components/Charts/Charts';
import { STATUSES, PLATFORMS, formatSalary } from '../../utils/helpers';

const statusColors = { Applied: 'var(--teal)', Interviewing: 'var(--yellow)', Offer: 'var(--green)', Rejected: 'var(--red)' };
const statusBg = { Applied: 'var(--teal-soft)', Interviewing: 'var(--yellow-soft)', Offer: 'var(--green-soft)', Rejected: 'var(--red-soft)' };

function Bar({ label, value, total, color, bg }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: bg, color, padding: '1px 6px', borderRadius: 3 }}>{value}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{pct}%</span>
        </div>
      </div>
      <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.7s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  );
}

export default function Analytics() {
  const { applications } = useApplicationContext();
  const total = applications.length;

  const interviewRate = total > 0 ? Math.round((applications.filter(a => ['Interviewing', 'Offer'].includes(a.status)).length / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((applications.filter(a => a.status === 'Offer').length / total) * 100) : 0;
  const avgSalary = applications.filter(a => a.salary).reduce((s, a, _, arr) => s + a.salary / arr.length, 0);

  const byPlatform = PLATFORMS.map(p => ({ label: p, value: applications.filter(a => a.platform === p).length })).filter(p => p.value > 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>A detailed breakdown of your job search metrics and patterns.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Applications', val: total, color: 'var(--accent)' },
          { label: 'Interview Rate', val: `${interviewRate}%`, color: 'var(--yellow)' },
          { label: 'Offer Rate', val: `${offerRate}%`, color: 'var(--green)' },
          { label: 'Avg. Salary', val: avgSalary ? `₹${(avgSalary / 100000).toFixed(1)}L` : '—', color: 'var(--teal)' },
        ].map(m => (
          <div key={m.label} className="card">
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>{m.label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 400, color: m.color, lineHeight: 1 }}>{m.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Monthly Trend</h2>
          <MonthlyBarChart applications={applications} />
        </div>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Status Distribution</h2>
          <StatusPieChart applications={applications} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, marginBottom: 22 }}>By Status</h2>
          {STATUSES.map(s => (
            <Bar key={s} label={s} value={applications.filter(a => a.status === s).length} total={total} color={statusColors[s]} bg={statusBg[s]} />
          ))}
        </div>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, marginBottom: 22 }}>By Platform</h2>
          {byPlatform.length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 300 }}>No data yet.</p>
            : byPlatform.map(p => (
              <Bar key={p.label} label={p.label} value={p.value} total={total} color="var(--accent)" bg="var(--accent-soft)" />
            ))}
        </div>
      </div>
    </div>
  );
}
