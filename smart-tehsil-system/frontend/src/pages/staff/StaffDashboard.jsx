import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Ticket, FileText, CheckCircle, ShieldCheck, Clock } from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [staffStatus, setStaffStatus] = useState('PRESENT');
  const [assignedApps, setAssignedApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffInfo();
  }, []);

  const fetchStaffInfo = async () => {
    try {
      const staffRes = await api.get('/staff');
      const myProfile = staffRes.data.find((s) => s.user_id === user.id);
      if (myProfile) setStaffStatus(myProfile.status);

      const appsRes = await api.get('/applications');
      setAssignedApps(appsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const staffRes = await api.get('/staff');
      const myProfile = staffRes.data.find((s) => s.user_id === user.id);
      if (myProfile) {
        await api.patch(`/staff/${myProfile.id}/status`, { status: newStatus });
        setStaffStatus(newStatus);
        showSuccess(`Your status updated to ${newStatus}`);
      }
    } catch (err) {
      showError('Failed to update status');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Staff Workstation</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage desk availability, assigned document verification, and live queue.</p>
        </div>
      </div>

      {/* Authorized Availability Toggle */}
      <div className="card card-body mb-6 flex items-center justify-between flex-wrap gap-4" style={{ background: '#fff' }}>
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} style={{ color: 'var(--primary-600)' }} />
          <div>
            <div style={{ fontWeight: '600', fontSize: '1rem' }}>Authorized Live Availability Status</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status is updated strictly by authorized staff only.</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['PRESENT', 'BUSY', 'ON_LEAVE', 'OFFLINE'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`btn btn-sm ${staffStatus === status ? 'btn-primary' : 'btn-secondary'}`}
            >
              ● {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="card card-body">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Assigned Applications for Document Verification</h3>
        
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : assignedApps.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <FileText size={36} />
            <p>No assigned applications.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>App Number</th>
                  <th>Service</th>
                  <th>Applicant</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedApps.map((app) => (
                  <tr key={app.id}>
                    <td><strong>{app.application_number}</strong></td>
                    <td>{app.service_name}</td>
                    <td>{app.applicant_name}</td>
                    <td><span className={`badge status-${app.status}`}>{app.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            api.patch(`/applications/${app.id}/status`, { status: 'DOCUMENT_VERIFICATION', remarks: 'Verified by staff' })
                              .then(() => { showSuccess('Marked verification complete'); fetchStaffInfo(); });
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          Verify Docs
                        </button>
                      </div>
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
