import { useState } from 'react';
import { toast } from 'react-toastify';
import { RiBookmarkFill } from 'react-icons/ri';
import { useApplications } from '../../hooks';
import JobCard from '../../components/JobCard/JobCard';
import ApplicationForm from '../../components/ApplicationForm/ApplicationForm';

export default function Bookmarks() {
  const { applications, updateApplication, deleteApplication, toggleBookmark } = useApplications();
  const [editing, setEditing] = useState(null);

  const bookmarked = applications.filter(a => a.bookmarked);

  const handleEdit = (data) => { updateApplication(data); toast.success('Updated!'); setEditing(null); };
  const handleDelete = (id) => { deleteApplication(id); toast.error('Deleted'); };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Bookmarks</h1>
        <p>{bookmarked.length} saved application{bookmarked.length !== 1 ? 's' : ''}</p>
      </div>

      {bookmarked.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <RiBookmarkFill size={40} />
            <h3>No bookmarks yet</h3>
            <p>Bookmark important applications from the Applications page to find them here.</p>
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
                <th>Applied</th>
                <th>Salary</th>
                <th>Platform</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookmarked.map(app => (
                <JobCard key={app.id} app={app} onEdit={setEditing} onDelete={handleDelete} onBookmark={toggleBookmark} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ApplicationForm
          initial={editing}
          onSubmit={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
