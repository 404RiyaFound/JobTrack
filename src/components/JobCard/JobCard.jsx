import { useState } from 'react';
import { RiEditLine, RiDeleteBinLine, RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri';
import { getStatusBadgeClass, formatDate, formatSalary, getDomain } from '../../utils/helpers';
import { getCompanyLogoUrl } from '../../services/api';

function CompanyLogo({ company }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="company-logo-fallback">{company[0]}</div>;
  return (
    <img
      className="company-logo"
      src={getCompanyLogoUrl(getDomain(company))}
      alt={company}
      onError={() => setFailed(true)}
    />
  );
}

export default function JobCard({ app, onEdit, onDelete, onBookmark }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    if (deleting) { onDelete(app.id); return; }
    setDeleting(true);
    setTimeout(() => setDeleting(false), 2000);
  };

  return (
    <tr className="fade-in">
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CompanyLogo company={app.company} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{app.company}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{app.location}</div>
          </div>
        </div>
      </td>
      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{app.role}</td>
      <td><span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span></td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{formatDate(app.appliedDate)}</td>
      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>{formatSalary(app.salary)}</td>
      <td><span className="tag">{app.platform}</span></td>
      <td>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn-icon" onClick={() => onBookmark(app.id)} title="Bookmark" style={{ color: app.bookmarked ? 'var(--yellow)' : undefined }}>
            {app.bookmarked ? <RiBookmarkFill size={15} /> : <RiBookmarkLine size={15} />}
          </button>
          <button className="btn-icon" onClick={() => onEdit(app)} title="Edit">
            <RiEditLine size={15} />
          </button>
          <button
            className="btn-icon"
            onClick={handleDelete}
            title={deleting ? 'Click again to confirm' : 'Delete'}
            style={{ color: deleting ? 'var(--red)' : undefined }}
          >
            <RiDeleteBinLine size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
