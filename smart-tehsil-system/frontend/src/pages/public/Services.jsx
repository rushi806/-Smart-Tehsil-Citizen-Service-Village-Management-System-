import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Search, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = '/services?';
      if (category) url += `category=${encodeURIComponent(category)}&`;
      const res = await api.get(url);
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Government Services Directory</h1>
          <p>Complete official guide to Tehsil certificates, fees, eligibility, and required documents.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div className="card card-body mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="search-box" style={{ flex: 1, minWidth: '280px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search service name (e.g. Income, Caste)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.9rem', padding: '0.625rem 1rem 0.625rem 2.5rem' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Filter Category:</span>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: 'auto', marginBottom: 0 }}
            >
              <option value="">All Categories</option>
              <option value="Revenue">Revenue</option>
              <option value="Social Welfare">Social Welfare</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No Services Found</h3>
            <p>Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map((svc) => (
              <Link key={svc.id} to={`/services/${svc.id}`} className="service-card">
                <div className="flex items-center justify-between">
                  <div className="service-icon">
                    <FileText size={24} />
                  </div>
                  <span className="badge badge-blue">₹{svc.fees}</span>
                </div>
                <div>
                  <h3 className="service-name">{svc.name}</h3>
                  <div className="service-dept">{svc.department_name || 'Tehsil Office'}</div>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {svc.description}
                </p>
                <div className="flex items-center justify-between mt-auto" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span><Clock size={14} inline /> {svc.processing_time_days} Days</span>
                  <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>View Details <ArrowRight size={14} inline /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
