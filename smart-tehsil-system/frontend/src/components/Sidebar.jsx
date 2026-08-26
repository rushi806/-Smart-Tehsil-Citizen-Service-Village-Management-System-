import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, Calendar, Ticket, AlertCircle,
  Bell, User, Users, MapPin, Award, Volume2, ShieldCheck,
  Briefcase, MessageSquare, HelpCircle, Settings, LogOut, ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const role = user.role;

  const citizenLinks = [
    { label: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'My Applications', path: '/citizen/applications', icon: FileText },
    { label: 'Book Appointment', path: '/citizen/appointments', icon: Calendar },
    { label: 'Get Token / Queue', path: '/citizen/tokens', icon: Ticket },
    { label: 'My Complaints', path: '/citizen/complaints', icon: AlertCircle },
    { label: 'Notifications', path: '/citizen/notifications', icon: Bell },
    { label: 'Profile', path: '/citizen/profile', icon: User },
  ];

  const staffLinks = [
    { label: 'Staff Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Applications', path: '/citizen/applications', icon: FileText },
    { label: 'Live Queue Manager', path: '/staff/queue', icon: Ticket },
    { label: 'Staff Profile', path: '/citizen/profile', icon: User },
  ];

  const officerLinks = [
    { label: 'Officer Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Review Applications', path: '/citizen/applications', icon: ShieldCheck },
    { label: 'Complaints', path: '/citizen/complaints', icon: AlertCircle },
    { label: 'Staff Workload', path: '/staff', icon: Users },
  ];

  const adminLinks = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Staff', path: '/admin/staff', icon: Briefcase },
    { label: 'Services & Docs', path: '/admin/services', icon: FileText },
    { label: 'Villages Directory', path: '/admin/villages', icon: MapPin },
    { label: 'Schemes', path: '/admin/schemes', icon: Award },
    { label: 'Notices', path: '/admin/notices', icon: Volume2 },
    { label: 'Applications', path: '/admin/applications', icon: FileText },
    { label: 'Complaints', path: '/admin/complaints', icon: AlertCircle },
    { label: 'AI Knowledge Base', path: '/admin/ai-knowledge', icon: HelpCircle },
  ];

  let links = citizenLinks;
  if (role === 'admin') links = adminLinks;
  else if (role === 'officer') links = officerLinks;
  else if (role === 'staff') links = staffLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-400)', fontWeight: '700' }}>
            {role.toUpperCase()} PORTAL
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.2rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {user.full_name}
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{link.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}

        <div className="sidebar-section-label" style={{ marginTop: '1.5rem' }}>Public Links</div>
        <Link to="/services" className="sidebar-link"><FileText size={18} /> Services Directory</Link>
        <Link to="/villages" className="sidebar-link"><MapPin size={18} /> Village Map</Link>
        <Link to="/ai-assistant" className="sidebar-link"><HelpCircle size={18} /> AI Assistant</Link>
      </nav>

      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={logout} className="sidebar-link w-full" style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5', border: 'none', cursor: 'pointer' }}>
          <LogOut size={18} />
          <span>Logout Account</span>
        </button>
      </div>
    </aside>
  );
}
