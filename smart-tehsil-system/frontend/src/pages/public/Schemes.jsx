import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, ExternalLink, Filter, Search } from 'lucide-react';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  const fetchSchemes = () => {
    setLoading(true);
    let url = '/schemes?';
    if (category) url += `category=${category}&`;
    api.get(url)
      .then((res) => setSchemes(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Farmers', value: 'farmer' },
    { label: 'Students', value: 'student' },
    { label: 'Women', value: 'women' },
    { label: 'Housing', value: 'housing' },
    { label: 'Senior Citizens', value: 'senior' },
  ];

  const filtered = schemes.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Government Schemes Directory</h1>
          <p>Official list of welfare schemes available for citizens, farmers, students, and women.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        
        <div className="card card-body mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="search-box" style={{ flex: 1, minWidth: '280px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search scheme name or benefit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.9rem', padding: '0.625rem 1rem 0.625rem 2.5rem' }}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`btn btn-sm ${category === c.value ? 'btn-primary' : 'btn-secondary'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Award size={48} />
            <h3>No Schemes Found</h3>
            <p>Try selecting a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {filtered.map((scheme) => (
              <div key={scheme.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span className="badge badge-orange mb-2" style={{ textTransform: 'capitalize' }}>
                    {scheme.category || 'General'}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>{scheme.name}</h3>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{scheme.description}</p>

                {scheme.benefits && (
                  <div style={{ background: 'var(--green-100)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--green-700)' }}>
                    <strong>Key Benefits:</strong> {scheme.benefits}
                  </div>
                )}

                {scheme.eligibility && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </div>
                )}

                {scheme.official_website && (
                  <a
                    href={scheme.official_website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline mt-auto"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Official Portal Link <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
