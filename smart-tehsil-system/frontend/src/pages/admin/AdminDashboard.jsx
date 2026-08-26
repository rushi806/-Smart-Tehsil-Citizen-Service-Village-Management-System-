import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Briefcase, FileText, MapPin, Award, Volume2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pieColors = ['#3b82f6', '#eab308', '#8b5cf6', '#22c55e', '#ef4444', '#0284c7'];

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>System Administration Overview</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tehsil system analytics, workload distribution, and module controls.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-4 mb-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                <Users size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.total_citizens || 0}</div>
                <div className="stat-label">Total Registered Citizens</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Briefcase size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.total_staff || 0}</div>
                <div className="stat-label">Staff ({stats?.present_staff || 0} Present)</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.total_applications || 0}</div>
                <div className="stat-label">Total Applications</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <MapPin size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats?.total_villages || 0}</div>
                <div className="stat-label">Villages Managed</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-2 mb-6">
            
            {/* Status Pie Chart */}
            <div className="card card-body">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Application Status Distribution</h3>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        stats?.application_status_breakdown
                          ? Object.entries(stats.application_status_breakdown).map(([k, v]) => ({ name: k, value: v }))
                          : [{ name: 'Submitted', value: 1 }]
                      }
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label
                    >
                      {pieColors.map((color, idx) => (
                        <Cell key={idx} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Summary */}
            <div className="card card-body">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Key System Metrics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <span>Active Government Services</span>
                  <strong>{stats?.total_services || 0} Services</strong>
                </div>

                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <span>Pending Application Queue</span>
                  <span className="badge badge-yellow">{stats?.pending_applications || 0} Pending</span>
                </div>

                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <span>Completed Certificates</span>
                  <span className="badge badge-green">{stats?.completed_applications || 0} Issued</span>
                </div>

                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <span>Open Grievances / Complaints</span>
                  <span className="badge badge-red">{stats?.open_complaints || 0} Open</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Average Citizen Rating</span>
                  <strong>⭐ {stats?.average_feedback_rating || '5.0'} / 5.0</strong>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
