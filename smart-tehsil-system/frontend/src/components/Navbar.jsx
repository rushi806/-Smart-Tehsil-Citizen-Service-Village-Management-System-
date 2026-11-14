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
    { label: 'Schemes', path: '/schemes', icon: Award },
    { label: 'Notices', path: '/notices', icon: Bell },
    { label: 'Track App', path: '/track-application', icon: Search },
    { label: 'AI Assistant', path: '/ai-assistant', icon: HelpCircle },
  ];

  const handleNavClick = (e) => { setMenuOpen(false); };

  return (
    <>
      {/* Top Government Ribbon */}
      <div className="top-gov-bar">
        <div className="container">
          <div className="gov-brand-text">
            <span className="gov-flag-strip">
              <span />
              <span />
              <span />
            </span>
            <span>महाराष्ट्र शासन / Government of Maharashtra • Citizen Service Portal</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Helpline: <strong>1800-120-8040</strong></span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ color: 'var(--accent-400)' }}>Smart Tehsil 2.0</span>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <div className="navbar-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
              </svg>
            </div>
            <div className="navbar-title">
              <h1>Tehsil Portal</h1>
              <span>Citizen Service & Village System</span>
            </div>
          </Link>

          <div className="navbar-nav">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} className={`nav-link ${active ? 'active' : ''}`} onClick={handleNavClick}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="navbar-actions">
            <Link to="/search" className="btn btn-sm btn-accent"><Search size={15} /> Search</Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to={getDashboardPath()} className="btn btn-sm btn-accent"><LayoutDashboard size={15} /> Dashboard</Link>
                <button onClick={logout} className="btn btn-sm btn-secondary" title="Logout"><LogOut size={15} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-sm btn-accent">Register</Link>
              </div>
            )}
          </div>

          <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

      <div className={`mobile-nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <Link to="/" onClick={() => setMenuOpen(false)} className="mobile-nav-brand">
            <div className="mobile-nav-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
              </svg>
            </div>
            <div className="mobile-nav-title">
              <h1>तहसील कार्यालय</h1>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary-200)', display: 'block' }}>Tehsil Portal</span>
            </div>
          </Link>
          <button onClick={() => setMenuOpen(false)} className="mobile-nav-close"><X size={24} /></button>
        </div>

        <div className="mobile-nav-links">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path} className={`mobile-nav-link ${active ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                {Icon && <Icon size={18} />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mobile-nav-actions">
          {isAuthenticated ? (
            <div className="mobile-nav-user">
              <Link to={getDashboardPath()} className="btn btn-block btn-accent"><LayoutDashboard size={16} /> Dashboard</Link>
              <button onClick={logout} className="btn btn-block btn-secondary mt-2"><LogOut size={16} /> Logout</button>
            </div>
          ) : (
            <div className="mobile-nav-auth">
              <Link to="/login" className="btn btn-block btn-accent">Login</Link>
              <Link to="/register" className="btn btn-block btn-secondary mt-2">Register</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Building2Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
  );
}
