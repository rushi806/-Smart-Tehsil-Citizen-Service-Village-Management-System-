import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, Check } from 'lucide-react';

export default function CitizenNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const markAllRead = () => {
    api.patch('/notifications/read-all').then(() => fetchNotifications());
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>In-App Notifications</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status updates for applications, appointments, and official notices.</p>
        </div>
        <button onClick={markAllRead} className="btn btn-sm btn-outline">
          <Check size={16} /> Mark All as Read
        </button>
      </div>

      <div className="card card-body" style={{ maxWidth: '800px' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : notifications.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <Bell size={36} />
            <p>No notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: n.is_read ? '#fff' : 'var(--primary-50)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <Bell size={20} style={{ color: 'var(--primary-600)', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{n.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
