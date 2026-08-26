import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, AlertCircle, Bell, Plus, Calendar, Ticket } from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/citizen').catch(() => ({ data: {} })),
      api.get('/applications?limit=5').catch(() => ({ data: [] })),
    ]).then(([statsRes, appsRes]) => {
      setStats(statsRes.data);
      setRecentApps(appsRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Welcome, {user.full_name}</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Citizen Self-Service Dashboard</p>
        </div>
        <Link to="/citizen/applications/new" className="btn btn-accent">
          <Plus size={18} /> New Application
        </Link>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-4 mb-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.total_applications || 0}</div>
                <div className="stat-label">Total Applications</div>
              </div>
            </div>

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
              <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.total_complaints || 0}</div>
                <div className="stat-label">Grievances / Complaints</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <Bell size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.unread_notifications || 0}</div>
                <div className="stat-label">Unread Notifications</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-3 mb-6">
            <Link to="/citizen/appointments" className="card card-body flex items-center gap-4">
              <Calendar size={28} style={{ color: 'var(--primary-600)' }} />
              <div>
                <h3 style={{ fontSize: '1rem' }}>Book Office Appointment</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Schedule desk appointment</div>
              </div>
            </Link>

            <Link to="/citizen/tokens" className="card card-body flex items-center gap-4">
              <Ticket size={28} style={{ color: 'var(--accent-500)' }} />
              <div>
                <h3 style={{ fontSize: '1rem' }}>Generate Digital Token</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live desk queue token</div>
              </div>
            </Link>

            <Link to="/citizen/complaints" className="card card-body flex items-center gap-4">
              <AlertCircle size={28} style={{ color: 'var(--red-600)' }} />
              <div>
                <h3 style={{ fontSize: '1rem' }}>Submit Grievance</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lodge complaint</div>
              </div>
            </Link>
          </div>

          {/* Recent Applications */}
          <div className="card card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '1.1rem' }}>My Recent Applications</h3>
              <Link to="/citizen/applications" className="btn btn-sm btn-outline">View All</Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <FileText size={36} />
                <p>You haven't submitted any applications yet.</p>
                <Link to="/citizen/applications/new" className="btn btn-sm btn-primary mt-2">Start Application</Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>App Number</th>
                      <th>Service</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app) => (
                      <tr key={app.id}>
                        <td><strong>{app.application_number}</strong></td>
                        <td>{app.service_name}</td>
                        <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                        <td><span className={`badge status-${app.status}`}>{app.status}</span></td>
                        <td>
                          <Link to={`/track-application?app_number=${app.application_number}`} className="btn btn-sm btn-secondary">
                            Track
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
