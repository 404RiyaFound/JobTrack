import { STATUSES, PLATFORMS, LOCATION_TYPES } from '../../utils/helpers';
import { RiFilterLine } from 'react-icons/ri';

export default function Filters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });
  const hasActive = Object.values(filters).some(v => v);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <RiFilterLine size={15} style={{ color: hasActive ? 'var(--accent)' : 'var(--text-muted)' }} />

      <select className="form-input" style={{ width: 'auto' }} value={filters.status || ''} onChange={e => set('status', e.target.value)}>
        <option value="">All Status</option>
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select className="form-input" style={{ width: 'auto' }} value={filters.platform || ''} onChange={e => set('platform', e.target.value)}>
        <option value="">All Platforms</option>
        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      <select className="form-input" style={{ width: 'auto' }} value={filters.location || ''} onChange={e => set('location', e.target.value)}>
        <option value="">All Locations</option>
        {LOCATION_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      {hasActive && (
        <button className="btn btn-ghost btn-sm" onClick={() => onChange({})}>Clear</button>
      )}
    </div>
  );
}
