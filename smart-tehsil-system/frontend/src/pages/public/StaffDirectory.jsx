import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Phone, Mail, Building, Clock, ShieldCheck } from 'lucide-react';

export default function StaffDirectory() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/staff')
      .then((res) => setStaffList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Tehsil Staff & Officer Directory</h1>
          <p>Official directory of authorized Tehsil staff, designations, room numbers, and live availability status.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        
        <div className="alert alert-info mb-6">
          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Authorized Availability Disclaimer:</strong> Staff presence/absence statuses displayed are updated only by authorized staff/admin. Statuses are never guessed or automatically generated.
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : staffList.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Staff Directory Found</h3>
          </div>
        ) : (
          <div className="grid grid-3">
            {staffList.map((staff) => (
              <div key={staff.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex items-center justify-between">
                  <span className={`badge status-${staff.status}`}>● {staff.status}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {staff.employee_id || 'N/A'}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>{staff.user_full_name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--accent-600)', fontWeight: '600' }}>{staff.designation}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{staff.department_name || 'Tehsil Office'}</div>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div className="flex items-center gap-2">
                    <Building size={14} style={{ color: 'var(--primary-600)' }} /> Office Room: <strong>{staff.office_room || 'Main Hall'}</strong>
                  </div>
                  {staff.official_phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} style={{ color: 'var(--primary-600)' }} /> Contact: <strong>{staff.official_phone}</strong>
                    </div>
                  )}
                  {staff.official_email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} style={{ color: 'var(--primary-600)' }} /> Email: <strong>{staff.official_email}</strong>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: 'var(--primary-600)' }} /> Working: {staff.working_days} ({staff.working_hours})
                  </div>
                </div>

                {staff.responsibilities && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Responsibilities:</strong> {staff.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
