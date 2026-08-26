import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText, Home, MapPin, Award, Bell, Search,
  User, LogOut, LayoutDashboard, HelpCircle, Menu, X, ShieldAlert
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'officer': return '/officer/dashboard';
      case 'staff': return '/staff/dashboard';
      default: return '/citizen/dashboard';
    }
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: FileText },
    { label: 'Checklist', path: '/documents', icon: Award },
    { label: 'Villages', path: '/villages', icon: MapPin },
    { label: 'Schemes', path: '/schemes' },
    { label: 'Notices', path: '/notices' },
    { label: 'Track App', path: '/track-application' },
    { label: 'AI Assistant', path: '/ai-assistant', icon: HelpCircle },
  ];

  return (
    <>
      <div className="demo-banner">
        ⚠️ SMART TEHSIL PORTAL — DEMO SYSTEM | All government data presented is for demonstration purposes.
      </div>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo">
              <Building2Icon />
            </div>
            <div className="navbar-title">
              <h1>Smart Tehsil Portal</h1>
              <span>Citizen Service & Village Management</span>
            </div>
          </Link>

          <div className="navbar-nav">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${active ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="navbar-actions">
            <Link to="/search" className="btn btn-sm btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              <Search size={16} /> Search
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to={getDashboardPath()} className="btn btn-sm btn-accent">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={logout} className="btn btn-sm btn-secondary" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-accent">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

function Building2Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}
