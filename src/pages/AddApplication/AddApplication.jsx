import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiArrowLeftLine, RiFlashlightLine, RiLoader4Line } from 'react-icons/ri';
import { useApplications } from '../../hooks';
import { STATUSES, PLATFORMS, LOCATION_TYPES } from '../../utils/helpers';
import { fetchDummyJobs } from '../../services/api';

const schema = yup.object({
  company: yup.string().required('Company name is required'),
  role: yup.string().required('Role is required'),
  location: yup.string().required('Location is required'),
  salary: yup.number().typeError('Enter a valid number').nullable().transform(v => isNaN(v) ? null : v),
  platform: yup.string().required('Platform is required'),
  status: yup.string().required('Status is required'),
  appliedDate: yup.string().required('Applied date is required'),
  interviewDate: yup.string().nullable(),
  notes: yup.string().nullable(),
});

// Map dummyjson product fields → job application fields
function mapProductToJob(product) {
  const brands = ['Google', 'Amazon', 'Microsoft', 'Stripe', 'Figma', 'Notion', 'Vercel', 'Netflix', 'Atlassian', 'Shopify'];
  const roles = ['Frontend Engineer', 'Backend Engineer', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Data Scientist', 'Full Stack Developer', 'Mobile Engineer'];
  return {
    company: brands[product.id % brands.length],
    role: roles[product.id % roles.length],
    salary: Math.round(product.price * 4200 * 12),   // price → annual ₹ salary (rough mapping)
    platform: 'LinkedIn',
    status: 'Applied',
    location: 'Remote',
    notes: product.description,
  };
}

export default function AddApplication() {
  const navigate = useNavigate();
  const { addApplication } = useApplications();
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'Applied', platform: 'LinkedIn' },
  });

  // Fetch dummy job suggestions on mount — demonstrates useEffect + Axios API call
  useEffect(() => {
    let cancelled = false;
    setLoadingSuggestions(true);
    fetchDummyJobs()
      .then(products => {
        if (!cancelled) setSuggestions(products.slice(0, 6).map(mapProductToJob));
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load suggestions');
      })
      .finally(() => {
        if (!cancelled) setLoadingSuggestions(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Auto-fill form when user clicks a suggestion
  const handleSuggestionClick = (job, index) => {
    setSelectedId(index);
    reset({
      company: job.company,
      role: job.role,
      salary: job.salary,
      platform: job.platform,
      status: job.status,
      location: job.location,
      notes: job.notes,
      appliedDate: '',
      interviewDate: '',
    });
    toast.info(`Form filled with ${job.company} — ${job.role}`);
  };

  const onSubmit = (data) => {
    addApplication(data);
    toast.success('Application added!');
    navigate('/applications');
  };

  const F = ({ name, label, children }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
          <RiArrowLeftLine size={14} /> Back
        </button>
        <h1>Add Application</h1>
        <p>Track a new job application</p>
      </div>

      {/* Job Suggestions from Dummy API */}
      <div className="card" style={{ maxWidth: 680, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <RiFlashlightLine size={15} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400 }}>Quick Fill from Job Listings</h2>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>Click any card to auto-fill the form</span>
        </div>

        {loadingSuggestions ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13, padding: '12px 0' }}>
            <RiLoader4Line size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Loading suggestions…
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {suggestions.map((job, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(job, i)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${selectedId === i ? 'var(--accent)' : 'var(--border)'}`,
                  background: selectedId === i ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <p style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)', marginBottom: 2 }}>{job.company}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 300 }}>{job.role}</p>
                <p style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                  ₹{(job.salary / 100000).toFixed(1)}L
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <F name="company" label="Company Name *">
              <input className="form-input" {...register('company')} placeholder="e.g. Google" />
            </F>
            <F name="role" label="Job Role *">
              <input className="form-input" {...register('role')} placeholder="e.g. Frontend Engineer" />
            </F>
            <F name="location" label="Location *">
              <select className="form-input" {...register('location')}>
                <option value="">Select location type…</option>
                {LOCATION_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </F>
            <F name="salary" label="Salary (₹ per year)">
              <input className="form-input" type="number" {...register('salary')} placeholder="e.g. 1800000" />
            </F>
            <F name="platform" label="Platform *">
              <select className="form-input" {...register('platform')}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </F>
            <F name="status" label="Status *">
              <select className="form-input" {...register('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </F>
            <F name="appliedDate" label="Applied Date *">
              <input className="form-input" type="date" {...register('appliedDate')} />
            </F>
            <F name="interviewDate" label="Interview Date">
              <input className="form-input" type="date" {...register('interviewDate')} />
            </F>
          </div>
          <F name="notes" label="Notes">
            <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} {...register('notes')} placeholder="Any notes about this application…" />
          </F>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Application</button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}