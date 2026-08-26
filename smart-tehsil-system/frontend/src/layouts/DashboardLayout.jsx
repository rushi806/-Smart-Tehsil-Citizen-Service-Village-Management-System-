import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Home, Search, User } from 'lucide-react';

export default function DashboardLayout({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner" style={{ height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Tehsil Office / Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="btn btn-sm btn-secondary" title="View Public Home">
              <Home size={16} /> Portal Home
            </Link>
            <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.full_name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', textTransform: 'capitalize' }}>
                {user.role} Account
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
