import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { AlertCircle, CheckCircle, Plus } from 'lucide-react';

export default function CitizenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deptId, setDeptId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchComplaints();
    api.get('/departments').then((res) => setDepartments(res.data || [])).catch(console.error);
  }, []);

  const fetchComplaints = () => {
    api.get('/complaints')
      .then((res) => setComplaints(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/complaints', {
        subject,
        description,
        department_id: deptId ? parseInt(deptId) : null,
      });
      showSuccess(`Grievance submitted! ID: ${res.data.complaint_number}`);
      setSubject('');
      setDescription('');
      setDeptId('');
      fetchComplaints();
    } catch (err) {
      showError('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Citizen Grievance Redressal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Submit complaints or grievances directly to the Tehsil Administration.</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: '2rem' }}>
        
        {/* Form */}
        <div>
          <div className="card card-body">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Lodge Grievance</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Subject <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Delay in certificate issuing"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Concerned Department</label>
                <select
                  className="form-input"
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                >
                  <option value="">-- General / Unspecified --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description <span className="required">*</span></label>
                <textarea
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete details..."
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </form>
          </div>
        </div>

        {/* Complaints Table */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card card-body">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>My Lodged Grievances</h3>
            
            {loading ? (
              <div className="loading-spinner"><div className="spinner"></div></div>
            ) : complaints.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <AlertCircle size={36} />
                <p>No complaints submitted.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Subject</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.complaint_number}</strong></td>
                        <td>{c.subject}</td>
                        <td>{new Date(c.submitted_at).toLocaleDateString()}</td>
                        <td><span className={`badge status-${c.status}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
