import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Home.css';
import {
  Search, FileText, CheckCircle2, MapPin, Award, Volume2,
  Calendar, Ticket, HelpCircle, ArrowRight, ShieldCheck, Clock,
  Users, ChevronDown, ChevronUp, Sparkles, Building, PhoneCall,
  Briefcase
} from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [trackId, setTrackId] = useState('');
  const [featuredServices, setFeaturedServices] = useState([]);
  const [latestNotices, setLatestNotices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/services/?featured=true').catch(() => ({ data: [] })),
      api.get('/notices/').catch(() => ({ data: [] })),
      api.get('/schemes/').catch(() => ({ data: [] })),
    ]).then(([svcsRes, noticesRes, schemesRes]) => {
      setFeaturedServices(Array.isArray(svcsRes.data) ? svcsRes.data : []);
      setLatestNotices(Array.isArray(noticesRes.data) ? noticesRes.data.slice(0, 4) : []);
      setSchemes(Array.isArray(schemesRes.data) ? schemesRes.data.slice(0, 3) : []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track-application?app_no=${encodeURIComponent(trackId.trim())}`);
    }
  };

  const popularSearches = [
    { title: 'Income Certificate', query: 'Income Certificate' },
    { title: 'Caste Certificate', query: 'Caste Certificate' },
    { title: 'Domicile Certificate', query: 'Domicile Certificate' },
    { title: 'Non-Creamy Layer', query: 'Non-Creamy Layer' },
    { title: '7/12 Extract', query: '7/12 Extract' },
    { title: 'Residence Certificate', query: 'Residence Certificate' },
  ];

  const faqs = [
    {
      q: 'How can I apply for a certificate or service online?',
      a: 'Register an account on the Tehsil Portal with your mobile number, navigate to "Service Directory", choose your desired certificate, verify required documents using the "Smart Checklist", and submit your application with required attachments.'
    },
    {
      q: 'What is the processing time for caste and income certificates?',
      a: 'As per the Maharashtra Right to Public Services Act (RTS), Income Certificates are typically issued within 15 working days, and Caste Certificates within 21-30 days upon physical or digital document verification.'
    },
    {
      q: 'How do I obtain a digital token for visiting the Tehsil office?',
      a: 'Log in as a citizen, go to "Get Token / Queue", select your service desk, and generate an e-token. You will receive an estimated time slot and can track live queue status from your mobile device.'
    },
    {
      q: 'Where can I find information about my Gram Panchayat and Talathi?',
      a: 'Click on "Villages Directory" in the navigation bar to browse demographic data, public amenities, Talathi circle assignments, and map locations for all villages under our Tehsil.'
    },
    {
      q: 'How do I lodge a citizen grievance or complaint?',
      a: 'Citizens can submit complaints through the "My Complaints" section in the dashboard or track existing grievance status using the "Track Complaint" portal.'
    }
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="home-hero">
        <div className="home-hero-pattern" />
        <div className="home-hero-container">
          <div className="home-hero-badge">
            <span style={{ fontSize: '1rem' }}>🏛️</span>
            <span>महाराष्ट्र शासन • Government of Maharashtra / Tehsil Administration</span>
          </div>

          <h1 className="home-hero-title">
            Smart Tehsil Citizen Service & <span>Village Management</span>
          </h1>

          <p className="home-hero-desc">
            Single-window digital gateway for revenue certificates, land documents, transparent application tracking, e-tokens, and village community administration.
          </p>

          {/* Smart Search Form */}
          <div className="home-search-wrapper">
            <form onSubmit={handleSearch} className="home-search-form">
              <Search className="home-search-icon" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search certificate or service (e.g., Income Certificate, Domicile, 7/12)..."
                className="home-search-input"
              />
              <button type="submit" className="home-search-btn">
                <span>Search</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Popular Tag Buttons */}
          <div className="home-popular-tags">
            <span className="home-popular-label">Popular Searches:</span>
            {popularSearches.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                className="home-tag-btn"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Floating Stats Bar */}
      <div className="home-stats-strip">
        <div className="home-stats-card">
          <div className="home-stat-item">
            <div className="home-stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
              <FileText size={24} />
            </div>
            <div>
              <div className="home-stat-value">15+</div>
              <div className="home-stat-label">Digital Citizen Services</div>
            </div>
          </div>

          <div className="home-stat-item">
            <div className="home-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <MapPin size={24} />
            </div>
            <div>
              <div className="home-stat-value">45+</div>
              <div className="home-stat-label">Gram Panchayats & Villages</div>
            </div>
          </div>

          <div className="home-stat-item">
            <div className="home-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <Ticket size={24} />
            </div>
            <div>
              <div className="home-stat-value">Smart Queue</div>
              <div className="home-stat-label">Digital Token & Appointments</div>
            </div>
          </div>

          <div className="home-stat-item">
            <div className="home-stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div className="home-stat-value">24x7 AI</div>
              <div className="home-stat-label">Multilingual Assistant</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* 3. Quick Application Tracker Widget */}
        <section className="home-tracker-section">
          <div className="home-tracker-box">
            <div className="home-tracker-text">
              <h3>
                <Search size={22} style={{ color: 'var(--primary-600)' }} />
                Instant Application Tracking
              </h3>
              <p>Enter your Tehsil Application Reference Number or Grievance ID to inspect live stage, desk officer, and remarks.</p>
            </div>
            <form onSubmit={handleQuickTrack} className="home-tracker-form">
              <input
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="Enter App Number (e.g. APP-2026-0001)"
                className="home-tracker-input"
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
                Track Now
              </button>
            </form>
          </div>
        </section>

        {/* 4. Core Pillars of Smart Tehsil */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="home-section-header">
            <div className="home-section-title-wrap">
              <h2>Key Citizen Portals & Services</h2>
              <p>Everything you need for seamless interaction with the Tehsil Administration.</p>
            </div>
            <Link to="/services" className="btn btn-sm btn-outline">
              Explore All Services <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-4">
            <div className="pillar-card">
              <div className="pillar-icon-box" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
                <FileText size={26} />
              </div>
              <div className="pillar-content">
                <h3>Services Directory</h3>
                <p>Complete guidelines, official fee schedules, and checklists for revenue certificates.</p>
                <Link to="/services" className="pillar-link">Browse Services <ArrowRight size={14} /></Link>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Award size={26} />
              </div>
              <div className="pillar-content">
                <h3>Smart Checklist</h3>
                <p>Generate exact document requirements before visiting or submitting your application.</p>
                <Link to="/documents" className="pillar-link">Generate Checklist <ArrowRight size={14} /></Link>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
                <MapPin size={26} />
              </div>
              <div className="pillar-content">
                <h3>Villages & Map</h3>
                <p>Search all villages, demographics, public amenities, and Talathi office jurisdictions.</p>
                <Link to="/villages" className="pillar-link">Explore Villages <ArrowRight size={14} /></Link>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <HelpCircle size={26} />
              </div>
              <div className="pillar-content">
                <h3>AI Tehsil Assistant</h3>
                <p>24x7 intelligent query answering on government rules, document lists, and procedures.</p>
                <Link to="/ai-assistant" className="pillar-link">Ask AI Assistant <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Featured Public Certificates (Dynamic from Backend) */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="home-section-header">
            <div className="home-section-title-wrap">
              <h2>Popular Citizen Certificates</h2>
              <p>Most frequently requested services with standard turnaround times under RTS Act.</p>
            </div>
            <Link to="/services" className="btn btn-sm btn-outline">
              View All ({featuredServices.length > 0 ? featuredServices.length : 15}) Services
            </Link>
          </div>

          <div className="grid home-services-grid">
            {featuredServices.slice(0, 8).map((svc) => (
              <Link key={svc.id} to={`/services/${svc.id}`} className="service-card-pro">
                <div className="service-card-top">
                  <div className="service-card-icon">
                    <FileText size={22} />
                  </div>
                  <span className="service-card-fee">
                    {svc.fees ? `Fee: ₹${svc.fees}` : 'Official Govt Fee'}
                  </span>
                </div>
                <div>
                  <div className="service-card-dept">{svc.department_name || 'Revenue Department'}</div>
                  <h3 className="service-card-name">{svc.name}</h3>
                </div>
                <p className="service-card-desc">
                  {svc.description}
                </p>
                <div className="service-card-footer">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{svc.processing_time_days ? `${svc.processing_time_days} days SLA` : 'Standard SLA'}</span>
                  </span>
                  <span className="service-card-link-text">
                    View Details <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Announcements & Schemes Split Grid */}
        <section className="home-split-grid">
          {/* Left: Official Notices & Tenders */}
          <div className="home-split-col">
            <div className="home-split-header">
              <h3>
                <Volume2 size={20} style={{ color: 'var(--accent-500)' }} />
                Official Notices & Circulars
              </h3>
              <Link to="/notices" style={{ fontSize: '0.825rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {latestNotices.length > 0 ? (
                latestNotices.map((notice) => (
                  <div key={notice.id} className="home-notice-item">
                    <div className="home-notice-meta">
                      <span className="badge badge-orange">{notice.category || 'NOTICE'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {notice.publish_date ? new Date(notice.publish_date).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <h4>{notice.title}</h4>
                    <p>{notice.description}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <p>No active circulars at this moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Government Welfare Schemes */}
          <div className="home-split-col">
            <div className="home-split-header">
              <h3>
                <Award size={20} style={{ color: 'var(--primary-600)' }} />
                Government Schemes
              </h3>
              <Link to="/schemes" style={{ fontSize: '0.825rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {schemes.length > 0 ? (
                schemes.map((scheme) => (
                  <div key={scheme.id} className="home-notice-item">
                    <div className="home-notice-meta">
                      <span className="badge badge-green">WELFARE SCHEME</span>
                    </div>
                    <h4>{scheme.name}</h4>
                    <p>{scheme.description}</p>
                    {scheme.benefits && (
                      <div style={{ fontSize: '0.775rem', color: 'var(--green-700)', marginTop: '0.25rem', fontWeight: 500 }}>
                        Benefit: {scheme.benefits}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <p>Check schemes directory for full listings.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 7. Citizen Charter & Office Information */}
        <section className="citizen-charter-card">
          <div className="citizen-charter-text">
            <h2>Citizens' Charter & Timings</h2>
            <p>
              The Tehsil Office is committed to responsive, accountable, and transparent public administration under the Maharashtra Right to Public Services Act, 2015.
            </p>
            <div className="citizen-charter-pills">
              <div className="charter-pill">
                <Clock size={16} style={{ color: 'var(--accent-400)' }} />
                <span>Working Hours: 10:00 AM – 5:45 PM (Mon–Sat)</span>
              </div>
              <div className="charter-pill">
                <Users size={16} style={{ color: 'var(--accent-400)' }} />
                <span>Lokshahi Din (Public Grievance): 1st Monday of Month</span>
              </div>
              <div className="charter-pill">
                <CheckCircle2 size={16} style={{ color: 'var(--accent-400)' }} />
                <span>Zero Tolerance for Citizen Delay</span>
              </div>
            </div>
          </div>

          <div className="citizen-charter-box-info">
            <div className="charter-info-row">
              <Building size={20} />
              <div>
                <strong>Tehsil & Taluka Magistrate Office</strong>
                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '2px' }}>
                  Administrative Building, Civil Court Road, Tehsil HQ
                </div>
              </div>
            </div>
            <div className="charter-info-row">
              <PhoneCall size={20} />
              <div>
                <strong>Toll-Free Public Helpline</strong>
                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '2px' }}>
                  1800-120-8040 / 02512-224400
                </div>
              </div>
            </div>
            <div className="charter-info-row">
              <Briefcase size={20} />
              <div>
                <strong>Appointment & Token Desk</strong>
                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '2px' }}>
                  Room No. 4, Ground Floor, Citizen Facilitation Centre
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Frequently Asked Questions (FAQ) */}
        <section style={{ marginBottom: '2rem' }}>
          <div className="home-section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div className="home-section-title-wrap">
              <h2>Frequently Asked Questions</h2>
              <p>Quick answers about documentation, online tokens, and Tehsil services.</p>
            </div>
          </div>

          <div className="home-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="home-faq-item">
                  <button
                    type="button"
                    className="home-faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--primary-600)" /> : <ChevronDown size={18} color="#94a3b8" />}
                  </button>
                  {isOpen && (
                    <div className="home-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
