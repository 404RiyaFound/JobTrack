import { NavLink, useNavigate } from 'react-router-dom';
import { RiDashboardLine, RiBriefcaseLine, RiBarChartBoxLine, RiBookmarkLine, RiAddLine } from 'react-icons/ri';
import { useApplicationContext } from '../../context/ApplicationContext';
import './Navbar.css';

const links = [
  { to: '/dashboard', icon: <RiDashboardLine size={16} />, label: 'Dashboard' },
  { to: '/applications', icon: <RiBriefcaseLine size={16} />, label: 'Applications' },
  { to: '/analytics', icon: <RiBarChartBoxLine size={16} />, label: 'Analytics' },
  { to: '/bookmarks', icon: <RiBookmarkLine size={16} />, label: 'Bookmarks' },
];

export default function Navbar() {
  const { applications } = useApplicationContext();
  const navigate = useNavigate();
  const bookmarked = applications.filter(a => a.bookmarked).length;

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <div className="topnav-brand">
          <span className="brand-mark">JT</span>
          <span className="brand-name">JobTrack</span>
        </div>

        <nav className="topnav-links">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}>
              {link.icon}
              {link.label}
              {link.to === '/bookmarks' && bookmarked > 0 && (
                <span className="topnav-count">{bookmarked}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="topnav-actions">
          <span className="topnav-meta">{applications.length} tracked</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/applications/new')}>
            <RiAddLine size={14} /> Add Job
          </button>
        </div>
      </div>
    </header>
  );
}
