import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ArrowLeft, Building2 } from 'lucide-react';

// Fix Leaflet default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function VillageMap() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/villages/map')
      .then((res) => setVillages(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Default center for Nashik/Tehsil region
  const defaultCenter = [19.9975, 73.7898];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <Link to="/villages" style={{ color: 'var(--primary-200)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Village List
          </Link>
          <h1>Interactive Tehsil Village Map</h1>
          <p>OpenStreetMap powered interactive map showing official village locations and demographics.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ height: '600px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {villages.map((v) => (
                  <Marker key={v.id} position={[v.latitude, v.longitude]}>
                    <Popup>
                      <div style={{ padding: '0.25rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-900)' }}>{v.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Gram Panchayat: {v.gram_panchayat_name || 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          Population: <strong>{v.population || 'N/A'}</strong>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <Link to={`/villages/${v.id}`} style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: '600' }}>
                            View Village Page →
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
