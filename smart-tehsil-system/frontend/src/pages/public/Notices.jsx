import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Volume2, Calendar, AlertTriangle } from 'lucide-react';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices')
      .then((res) => setNotices(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Official Notices & Announcements</h1>
          <p>Latest official circulars, holidays, camps, and public announcements from Tehsil Administration.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : notices.length === 0 ? (
          <div className="empty-state">
            <Volume2 size={48} />
            <h3>No Active Notices</h3>
            <p>Check back later for official announcements.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {notices.map((n) => (
              <div key={n.id} className="card card-body">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-orange">{n.category}</span>
                    {n.priority === 'HIGH' && <span className="badge badge-red"><AlertTriangle size={12} /> High Priority</span>}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Published: {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>{n.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{n.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
