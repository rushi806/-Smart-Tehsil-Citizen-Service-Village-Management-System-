import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    setLoading(true);
    api.get('/complaints')
      .then((res) => setComplaints(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleResolve = async (id) => {
    const note = prompt('Enter resolution summary for citizen:');
    if (!note) return;

    try {
      await api.patch(`/complaints/${id}/status`, {
        status: 'RESOLVED',
        resolution_note: note,
      });
      showSuccess('Grievance resolved');
      fetchComplaints();
    } catch (err) {
      showError('Failed to resolve complaint');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Grievances & Complaints Redressal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Review and resolve submitted citizen grievances.</p>
        </div>
      </div>

      <div className="card card-body">
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Citizen</th>
                  <th>Subject</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.complaint_number}</strong></td>
                    <td>{c.citizen_name}</td>
                    <td>{c.subject}</td>
                    <td>{new Date(c.submitted_at).toLocaleDateString()}</td>
                    <td><span className={`badge status-${c.status}`}>{c.status}</span></td>
                    <td>
                      {c.status !== 'RESOLVED' && (
                        <button onClick={() => handleResolve(c.id)} className="btn btn-sm btn-primary">
                          <CheckCircle size={14} /> Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
