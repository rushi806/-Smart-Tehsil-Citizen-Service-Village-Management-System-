import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function OfficerDashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      const statsRes = await api.get('/dashboard/officer');
      setStats(statsRes.data);

      const appsRes = await api.get('/applications');
      setApplications(appsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    let remarks = '';
    let rejection_reason = '';

    if (newStatus === 'REJECTED') {
      rejection_reason = prompt('Please enter reason for rejection:') || 'Document mismatch';
      if (!rejection_reason) return;
    } else {
      remarks = prompt('Enter officer approval remarks:') || 'Approved after review';
    }

    try {
      await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        remarks,
        rejection_reason,
      });
      showSuccess(`Application ${newStatus.toLowerCase()} successfully`);
      fetchOfficerData();
    } catch (err) {
      showError('Failed to update application status');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Officer Review Portal</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Review verified Tehsil service applications and issue approvals or rejections.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-4 mb-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.pending_applications || 0}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.under_review || 0}</div>
                <div className="stat-label">Under Active Review</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.approved_applications || 0}</div>
                <div className="stat-label">Approved Applications</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.open_complaints || 0}</div>
                <div className="stat-label">Open Grievances</div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="card card-body">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Service Applications for Officer Review</h3>
            
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>App Number</th>
                    <th>Service</th>
                    <th>Applicant</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td><strong>{app.application_number}</strong></td>
                      <td>{app.service_name}</td>
                      <td>{app.applicant_name}</td>
                      <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                      <td><span className={`badge status-${app.status}`}>{app.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                            className="btn btn-sm btn-primary"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                            className="btn btn-sm btn-danger"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
