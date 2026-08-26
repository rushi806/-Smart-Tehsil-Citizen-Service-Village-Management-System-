import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, FileText, MapPin, Award, Volume2, Users, ArrowRight } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.get(`/search?q=${encodeURIComponent(query)}`)
        .then((res) => setResults(res.data.results))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Smart Global Search</h1>
          <p>Results for query: "{query}"</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : !results ? (
          <div className="empty-state">
            <Search size={48} />
            <h3>Enter a search query</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Services */}
            {results.services && results.services.length > 0 && (
              <div>
                <h3 className="section-title mb-4"><FileText size={20} /> Services ({results.services.length})</h3>
                <div className="grid grid-3">
                  {results.services.map((s) => (
                    <Link key={s.id} to={`/services/${s.id}`} className="service-card">
                      <div className="service-name">{s.name}</div>
                      <div className="service-dept">Category: {s.category || 'Revenue'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: '600', marginTop: '0.5rem' }}>View Service Details →</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Villages */}
            {results.villages && results.villages.length > 0 && (
              <div>
                <h3 className="section-title mb-4"><MapPin size={20} /> Villages ({results.villages.length})</h3>
                <div className="grid grid-3">
                  {results.villages.map((v) => (
                    <Link key={v.id} to={`/villages/${v.id}`} className="card card-body">
                      <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)' }}>{v.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>District: {v.district || 'Demo District'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: '600', marginTop: '0.5rem' }}>View Village Info →</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Schemes */}
            {results.schemes && results.schemes.length > 0 && (
              <div>
                <h3 className="section-title mb-4"><Award size={20} /> Government Schemes ({results.schemes.length})</h3>
                <div className="grid grid-3">
                  {results.schemes.map((sc) => (
                    <Link key={sc.id} to="/schemes" className="card card-body">
                      <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)' }}>{sc.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category: {sc.category}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
