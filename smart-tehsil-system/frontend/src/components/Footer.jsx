import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--primary-900)', color: '#fff', borderTop: '4px solid var(--accent-500)', marginTop: '4rem' }}>
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div className="grid grid-4" style={{ gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>Smart Tehsil Office</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--primary-200)', lineHeight: '1.7' }}>
              Centralized Digital Citizen Service Portal providing transparent, fast, and accessible services to citizens and village communities.
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#fcd34d', fontWeight: '500' }}>
              ⚠️ Demo project for government service management.
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary-200)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/services" style={{ color: 'var(--gray-300)' }}>Service Directory</Link></li>
              <li><Link to="/documents" style={{ color: 'var(--gray-300)' }}>Document Checklist</Link></li>
              <li><Link to="/villages" style={{ color: 'var(--gray-300)' }}>Village Directory</Link></li>
              <li><Link to="/villages/map" style={{ color: 'var(--gray-300)' }}>Interactive Village Map</Link></li>
              <li><Link to="/schemes" style={{ color: 'var(--gray-300)' }}>Government Schemes</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary-200)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Citizen Services</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><Link to="/track-application" style={{ color: 'var(--gray-300)' }}>Track Application</Link></li>
              <li><Link to="/track-complaint" style={{ color: 'var(--gray-300)' }}>Track Complaint</Link></li>
              <li><Link to="/staff" style={{ color: 'var(--gray-300)' }}>Staff Directory</Link></li>
              <li><Link to="/ai-assistant" style={{ color: 'var(--gray-300)' }}>AI Service Assistant</Link></li>
              <li><Link to="/login" style={{ color: 'var(--gray-300)' }}>Portal Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary-200)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Tehsil</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--gray-300)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ flexShrink: 0, color: 'var(--accent-400)', marginTop: '2px' }} />
                <span>Tehsil Office Premises, Main Road, Demo District, Pin 000001</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={18} style={{ flexShrink: 0, color: 'var(--accent-400)' }} />
                <span>Helpline: 02512-000000 (Mon-Fri 10AM-5PM)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={18} style={{ flexShrink: 0, color: 'var(--accent-400)' }} />
                <span>helpdesk@tehsil.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
          <div>© {new Date().getFullYear()} Smart Tehsil Citizen Service Portal. Built for Public Governance.</div>
          <div>All official rules, document checklists, and fees are subject to verification at the Tehsil Office.</div>
        </div>
      </div>
    </footer>
  );
}
