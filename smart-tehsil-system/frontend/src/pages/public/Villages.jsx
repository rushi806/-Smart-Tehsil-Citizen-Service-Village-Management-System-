import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MapPin, Search, Users, Home, School, Hospital, ArrowRight } from 'lucide-react';

export default function Villages() {
  const [villages, setVillages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/villages')
      .then((res) => setVillages(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = villages.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.pin_code && v.pin_code.includes(search))
  );

  return (
    <div>
      <div className="page-hero">
        <div className="container flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1>Tehsil Village Directory</h1>
            <p>Complete official information about all villages under the Tehsil.</p>
          </div>
          <Link to="/villages/map" className="btn btn-accent">
            <MapPin size={18} /> Open Interactive Map
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        
        {/* Search */}
        <div className="card card-body mb-6">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search village by name or PIN code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.9rem', padding: '0.625rem 1rem 0.625rem 2.5rem' }}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <MapPin size={48} />
            <h3>No Villages Found</h3>
            <p>Try searching for a different village name.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map((v) => (
              <div key={v.id} className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>{v.name}</h3>
                    {v.pin_code && <span className="badge badge-blue">PIN: {v.pin_code}</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Gram Panchayat: {v.gram_panchayat_name || 'N/A'}
                  </div>
                </div>

                <div className="grid grid-3" style={{ background: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Population</div>
                    <div style={{ fontWeight: '700' }}>{v.population || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Households</div>
                    <div style={{ fontWeight: '700' }}>{v.households || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Area (Ha)</div>
                    <div style={{ fontWeight: '700' }}>{v.area_hectares || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap" style={{ fontSize: '0.75rem' }}>
                  {v.has_school && <span className="badge badge-green">🏫 School</span>}
                  {v.has_health_centre && <span className="badge badge-green">🏥 Health Centre</span>}
                  {v.has_anganwadi && <span className="badge badge-green">👶 Anganwadi</span>}
                  {v.has_electricity && <span className="badge badge-blue">⚡ Electricity</span>}
                </div>

                <Link to={`/villages/${v.id}`} className="btn btn-sm btn-outline mt-auto w-full">
                  View Full Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
