import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { MapPin, ArrowLeft, Users, Home, School, Hospital, Zap, Phone } from 'lucide-react';

export default function VillageDetail() {
  const { id } = useParams();
  const [village, setVillage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/villages/${id}`)
      .then((res) => setVillage(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!village) return <div className="container" style={{ padding: '3rem' }}><h2>Village not found</h2></div>;

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <Link to="/villages" style={{ color: 'var(--primary-200)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Village Directory
          </Link>
          <h1>Village: {village.name}</h1>
          <p>Gram Panchayat: {village.gram_panchayat_name || 'N/A'} | District: {village.district || 'Demo District'}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div className="grid grid-3" style={{ gap: '2rem' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <div className="card card-body mb-6">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Village Demographics & General Info</h2>
              
              <div className="grid grid-3 mb-6" style={{ gap: '1rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Population</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{village.population || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Households</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{village.households || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Area (Hectares)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{village.area_hectares || 'N/A'}</div>
                </div>
              </div>

              {village.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Overview</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{village.description}</p>
                </div>
              )}

              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Public Infrastructure & Amenities:</h3>
              <div className="grid grid-2" style={{ gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <School size={20} style={{ color: village.has_school ? 'var(--green-600)' : 'var(--gray-400)' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Primary / Secondary School</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{village.has_school ? 'Available in village' : 'Not available'}</div>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Hospital size={20} style={{ color: village.has_health_centre ? 'var(--green-600)' : 'var(--gray-400)' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Health Sub-Centre</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{village.has_health_centre ? 'Available in village' : 'Not available'}</div>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Zap size={20} style={{ color: village.has_electricity ? 'var(--green-600)' : 'var(--gray-400)' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Electricity Facility</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{village.has_electricity ? 'Electrified' : 'Partial'}</div>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Home size={20} style={{ color: village.has_anganwadi ? 'var(--green-600)' : 'var(--gray-400)' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Anganwadi Centre</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{village.has_anganwadi ? 'Available' : 'Not available'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card card-body mb-6">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Location Coordinates</h3>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>Latitude: {village.latitude || 'N/A'}</div>
                <div>Longitude: {village.longitude || 'N/A'}</div>
                <div>PIN Code: {village.pin_code || 'N/A'}</div>
              </div>

              {village.latitude && village.longitude && (
                <Link to={`/villages/map?highlight=${village.id}`} className="btn btn-primary w-full mt-4">
                  <MapPin size={16} /> View on Map
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
