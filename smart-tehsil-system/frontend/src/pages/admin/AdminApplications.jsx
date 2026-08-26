import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    api.get('/applications')
      .then((res) => setApplications(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Master Applications Overview</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full administrative audit of all citizen service applications.</p>
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
                  <th>App Number</th>
                  <th>Service</th>
                  <th>Applicant</th>
                  <th>Phone</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Track</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td><strong>{app.application_number}</strong></td>
                    <td>{app.service_name}</td>
                    <td>{app.applicant_name}</td>
                    <td>{app.applicant_phone || 'N/A'}</td>
                    <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                    <td><span className={`badge status-${app.status}`}>{app.status}</span></td>
                    <td>
                      <Link to={`/track-application?app_number=${app.application_number}`} className="btn btn-sm btn-secondary">
                        <Eye size={14} /> Progress
                      </Link>
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
