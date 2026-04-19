import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { RiAddLine, RiArrowUpDownLine } from 'react-icons/ri';
import { useApplications, useDebounce } from '../../hooks';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import JobCard from '../../components/JobCard/JobCard';
import ApplicationForm from '../../components/ApplicationForm/ApplicationForm';

const TABS = ['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const SORT_OPTIONS = [
  { value: 'appliedDate_desc', label: 'Newest first' },
  { value: 'appliedDate_asc', label: 'Oldest first' },
  { value: 'salary_desc', label: 'Salary ↓' },
  { value: 'salary_asc', label: 'Salary ↑' },
  { value: 'company_asc', label: 'Company A→Z' },
];

export default function Applications() {
  const { applications, addApplication, updateApplication, deleteApplication, toggleBookmark } = useApplications();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('appliedDate_desc');
  const [tab, setTab] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const debouncedSearch = useDebounce(search, 500);

  const filtered = useMemo(() => {
    let list = [...applications];
    if (tab !== 'All') list = list.filter(a => a.status === tab);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(a => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q));
    }
    if (filters.status) list = list.filter(a => a.status === filters.status);
    if (filters.platform) list = list.filter(a => a.platform === filters.platform);
    if (filters.location) list = list.filter(a => a.location === filters.location);
    const [field, dir] = sort.split('_');
    list.sort((a, b) => {
      let va = a[field], vb = b[field];
      if (field === 'appliedDate') { va = new Date(va || 0); vb = new Date(vb || 0); }
      if (field === 'salary') { va = Number(va || 0); vb = Number(vb || 0); }
      if (field === 'company') { va = va?.toLowerCase(); vb = vb?.toLowerCase(); }
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [applications, debouncedSearch, filters, sort, tab]);

  const tabCount = t => t === 'All' ? applications.length : applications.filter(a => a.status === t).length;

  const handleAdd = d => { addApplication(d); toast.success('Application added'); };
  const handleEdit = d => { updateApplication(d); toast.success('Application updated'); setEditing(null); };
  const handleDelete = id => { deleteApplication(id); toast.error('Deleted'); };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>Applications</h1>
          <p>{applications.length} total applications tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <RiAddLine size={16} /> Add Application
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RiArrowUpDownLine size={14} style={{ color: 'var(--text-muted)' }} />
          <select className="form-input" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <Filters filters={filters} onChange={setFilters} />
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}<span className="tab-count">{tabCount(t)}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <RiAddLine size={36} />
            <h3>No applications found</h3>
            <p>Adjust your filters or add a new application to get started.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th className="sortable" onClick={() => setSort(s => s === 'appliedDate_desc' ? 'appliedDate_asc' : 'appliedDate_desc')}>Applied</th>
                <th className="sortable" onClick={() => setSort(s => s === 'salary_desc' ? 'salary_asc' : 'salary_desc')}>Salary</th>
                <th>Platform</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <JobCard key={app.id} app={app} onEdit={setEditing} onDelete={handleDelete} onBookmark={toggleBookmark} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showForm || editing) && (
        <ApplicationForm
          initial={editing}
          onSubmit={editing ? handleEdit : handleAdd}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
