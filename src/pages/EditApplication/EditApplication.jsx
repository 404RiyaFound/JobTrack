import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiArrowLeftLine } from 'react-icons/ri';
import { useApplications } from '../../hooks';
import { STATUSES, PLATFORMS, LOCATION_TYPES } from '../../utils/helpers';

const schema = yup.object({
  company: yup.string().required('Company name is required'),
  role: yup.string().required('Role is required'),
  location: yup.string().required('Location is required'),
  salary: yup.number().typeError('Enter a valid number').nullable().transform(v => isNaN(v) ? null : v),
  platform: yup.string().required(),
  status: yup.string().required(),
  appliedDate: yup.string().required('Applied date is required'),
  interviewDate: yup.string().nullable(),
  notes: yup.string().nullable(),
});

export default function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, updateApplication } = useApplications();
  const app = applications.find(a => a.id === id);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: app || {},
  });

  if (!app) return (
    <div className="fade-in">
      <div className="page-header"><h1>Not Found</h1><p>Application not found.</p></div>
      <button className="btn btn-ghost" onClick={() => navigate('/applications')}><RiArrowLeftLine size={14} /> Back</button>
    </div>
  );

  const onSubmit = (data) => {
    updateApplication({ ...app, ...data });
    toast.success('Application updated!');
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
        <h1>Edit Application</h1>
        <p>Update details for {app.company}</p>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <F name="company" label="Company Name *">
              <input className="form-input" {...register('company')} />
            </F>
            <F name="role" label="Job Role *">
              <input className="form-input" {...register('role')} />
            </F>
            <F name="location" label="Location *">
              <select className="form-input" {...register('location')}>
                <option value="">Select…</option>
                {LOCATION_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </F>
            <F name="salary" label="Salary (₹ per year)">
              <input className="form-input" type="number" {...register('salary')} />
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
            <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} {...register('notes')} />
          </F>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
