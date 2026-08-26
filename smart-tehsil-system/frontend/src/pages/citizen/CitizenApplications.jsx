import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Plus, Search, Eye } from 'lucide-react';

export default function CitizenApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications')
      .then((res) => setApplications(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>My Applications</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track and manage all your submitted Tehsil service applications.</p>
        </div>
        <Link to="/citizen/applications/new" className="btn btn-accent">
          <Plus size={18} /> Apply for New Service
        </Link>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No Applications Submitted</h3>
          <p>Click below to apply for your first certificate or service.</p>
          <Link to="/citizen/applications/new" className="btn btn-primary mt-4">New Application</Link>
        </div>
      ) : (
        <div className="card card-body">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>App Number</th>
                  <th>Service</th>
                  <th>Applicant Name</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Action</th>
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
                      <Link to={`/track-application?app_number=${app.application_number}`} className="btn btn-sm btn-secondary">
                        <Eye size={14} /> View Progress
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
