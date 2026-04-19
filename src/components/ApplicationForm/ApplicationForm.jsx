import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiCloseLine } from 'react-icons/ri';
import { STATUSES, PLATFORMS, LOCATION_TYPES } from '../../utils/helpers';

const schema = yup.object({
  company: yup.string().required('Company name is required'),
  role: yup.string().required('Role is required'),
  location: yup.string().required('Location is required'),
  salary: yup.number().typeError('Enter a valid number').min(0).nullable().transform(v => (isNaN(v) ? null : v)),
  platform: yup.string().required('Platform is required'),
  status: yup.string().required('Status is required'),
  appliedDate: yup.string().required('Applied date is required'),
  interviewDate: yup.string().nullable(),
  notes: yup.string().nullable(),
});

export default function ApplicationForm({ initial, onSubmit, onClose }) {
  const isEdit = !!initial?.id;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initial || { status: 'Applied', platform: 'LinkedIn' },
  });

  const submit = (data) => {
    onSubmit(isEdit ? { ...initial, ...data } : data);
    onClose();
  };

  const F = ({ name, label, type = 'text', children }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children || <input type={type} className="form-input" {...register(name)} />}
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Application' : 'Add Application'}</h2>
          <button className="btn-icon" onClick={onClose}><RiCloseLine size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <F name="company" label="Company Name *" />
            <F name="role" label="Job Role *" />
            <F name="location" label="Location *">
              <select className="form-input" {...register('location')}>
                <option value="">Select…</option>
                {LOCATION_TYPES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </F>
            <F name="salary" label="Salary (₹ per year)" type="number" />
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
            <F name="appliedDate" label="Applied Date *" type="date" />
            <F name="interviewDate" label="Interview Date" type="date" />
          </div>
          <F name="notes" label="Notes">
            <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} {...register('notes')} />
          </F>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isEdit ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
