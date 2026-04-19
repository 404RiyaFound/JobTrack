import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

export default function SearchBar({ value, onChange, placeholder = 'Search by company or role…' }) {
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <RiSearchLine size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
      <input
        className="form-input"
        style={{ paddingLeft: 36, paddingRight: value ? 36 : 14 }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="btn-icon" onClick={() => onChange('')} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: 4 }}>
          <RiCloseLine size={14} />
        </button>
      )}
    </div>
  );
}
