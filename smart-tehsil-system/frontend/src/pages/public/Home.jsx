import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Search, FileText, CheckCircle2, MapPin, Award, Volume2,
  Calendar, Ticket, HelpCircle, ArrowRight, ShieldCheck, Clock, Users
} from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [featuredServices, setFeaturedServices] = useState([]);
  const [latestNotices, setLatestNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/services?featured=true').catch(() => ({ data: [] })),
      api.get('/notices').catch(() => ({ data: [] })),
    ]).then(([svcsRes, noticesRes]) => {
      setFeaturedServices(svcsRes.data || []);
      setLatestNotices(noticesRes.data ? noticesRes.data.slice(0, 3) : []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickLinks = [
    { title: 'Income Certificate', query: 'Income Certificate', icon: FileText },
    { title: 'Caste Certificate', query: 'Caste Certificate', icon: Award },
    { title: 'Domicile Certificate', query: 'Domicile Certificate', icon: CheckCircle2 },
    { title: 'Non-Creamy Layer', query: 'Non-Creamy Layer Certificate', icon: ShieldCheck },
    { title: 'Residence Proof', query: 'Residence Certificate', icon: MapPin },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            🏛️ Government of Maharashtra / Tehsil Administration
          </div>
          <h1>Smart Tehsil Citizen Service Portal</h1>
          <p>
            Access transparent government services, generate document checklists, book Tehsil appointments, track application status, and view village information.
          </p>

          <form onSubmit={handleSearch} className="search-box mb-6">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What service or information are you looking for? (e.g. Income Certificate, Domicile)"
            />
            <button type="submit" className="btn btn-accent search-btn">
              Search Portal
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--primary-200)', fontWeight: '500' }}>Popular Searches:</span>
            {quickLinks.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        
        {/* Quick Action Grid */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <h2 className="section-title">Key Citizen Services</h2>
            <Link to="/services" className="btn btn-sm btn-outline">View All Services <ArrowRight size={16} /></Link>
          </div>

          <div className="grid grid-4">
            <div className="card card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="service-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Service Directory</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Find fees, eligibility, and step-by-step procedure for all Tehsil services.</p>
                <Link to="/services" style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: '600', display: 'inline-block', marginTop: '0.5rem' }}>Explore Services →</Link>
              </div>
            </div>

            <div className="card card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="service-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Award size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Smart Checklist</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Select your service to generate an official checklist of required documents.</p>
                <Link to="/documents" style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: '600', display: 'inline-block', marginTop: '0.5rem' }}>Generate Checklist →</Link>
              </div>
            </div>

            <div className="card card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="service-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Village Map & Directory</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Explore villages under Tehsil with demographics, facilities, and map coordinates.</p>
                <Link to="/villages" style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: '600', display: 'inline-block', marginTop: '0.5rem' }}>View Villages →</Link>
              </div>
            </div>

            <div className="card card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="service-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <HelpCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>AI Tehsil Assistant</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Ask instant questions about documents, rules, office hours, and services.</p>
                <Link to="/ai-assistant" style={{ fontSize: '0.8125rem', color: 'var(--primary-600)', fontWeight: '600', display: 'inline-block', marginTop: '0.5rem' }}>Ask AI Assistant →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Certificates */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <h2 className="section-title">Popular Certificates & Services</h2>
          </div>

          <div className="grid grid-3">
            {featuredServices.map((svc) => (
              <Link key={svc.id} to={`/services/${svc.id}`} className="service-card">
                <div className="flex items-center justify-between">
                  <div className="service-icon">
                    <FileText size={24} />
                  </div>
                  <span className="badge badge-green">Fee: ₹{svc.fees}</span>
                </div>
                <div>
                  <h3 className="service-name">{svc.name}</h3>
                  <div className="service-dept">{svc.department_name || 'Revenue Department'}</div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {svc.description}
                </p>
                <div className="flex items-center justify-between mt-auto" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-2"><Clock size={14} /> {svc.processing_time_days} days</span>
                  <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Announcements & Notices */}
        {latestNotices.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div className="section-header">
              <h2 className="section-title"><Volume2 size={20} style={{ color: 'var(--accent-500)' }} /> Official Notices & Announcements</h2>
              <Link to="/notices" className="btn btn-sm btn-outline">View All Notices</Link>
            </div>

            <div className="grid grid-3">
              {latestNotices.map((notice) => (
                <div key={notice.id} className="card card-body">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-orange">{notice.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{notice.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
