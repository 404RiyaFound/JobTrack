import { useApplicationContext } from '../../context/ApplicationContext';
import { StatusPieChart, MonthlyBarChart } from '../../components/Charts/Charts';
import { formatDate, formatSalary, getStatusBadgeClass } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { RiBriefcase2Line, RiCalendar2Line, RiTrophyLine, RiEmotionSadLine } from 'react-icons/ri';

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <span style={{ color: accent, fontSize: 18, opacity: 0.8 }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, lineHeight: 1, color: 'var(--text-primary)' }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 300 }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { applications } = useApplicationContext();

  const total = applications.length;
  const interviews = applications.filter(a => a.status === 'Interviewing').length;
  const offers = applications.filter(a => a.status === 'Offer').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const rate = total > 0 ? Math.round((interviews + offers) / total * 100) : 0;

  const upcoming = applications
    .filter(a => a.interviewDate && new Date(a.interviewDate) >= new Date())
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 5);

  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 4);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Good to see you.</h1>
        <p>Here's how your job search is going — {total} applications tracked so far.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Applied" value={total} icon={<RiBriefcase2Line />} accent="var(--accent)" sub="across all platforms" />
        <StatCard label="In Progress" value={interviews} icon={<RiCalendar2Line />} accent="var(--yellow)" sub={`${rate}% interview rate`} />
        <StatCard label="Offers" value={offers} icon={<RiTrophyLine />} accent="var(--green)" sub={offers > 0 ? 'Congratulations!' : 'Keep going'} />
        <StatCard label="Rejected" value={rejected} icon={<RiEmotionSadLine />} accent="var(--red)" sub="part of the process" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400 }}>Monthly Activity</h2>
          </div>
          <MonthlyBarChart applications={applications} />
        </div>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Pipeline Split</h2>
          <StatusPieChart applications={applications} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400 }}>Upcoming Interviews</h2>
            <Link to="/applications" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 300 }}>No upcoming interviews scheduled yet.</p>
          ) : upcoming.map(app => (
            <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 13 }}>{app.company}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 300 }}>{app.role}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)', background: 'var(--yellow-soft)', padding: '3px 8px', borderRadius: 4 }}>{formatDate(app.interviewDate)}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400 }}>Recently Added</h2>
            <Link to="/applications" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 300 }}>No applications yet.</p>
          ) : recent.map(app => (
            <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 13 }}>{app.company}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 300 }}>{app.role}</p>
              </div>
              <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
