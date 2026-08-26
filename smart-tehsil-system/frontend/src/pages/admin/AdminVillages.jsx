import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminVillages() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [population, setPopulation] = useState('');
  const [households, setHouseholds] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [hasSchool, setHasSchool] = useState(false);
  const [hasHealth, setHasHealth] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = () => {
    setLoading(true);
    api.get('/villages')
      .then((res) => setVillages(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateVillage = async (e) => {
    e.preventDefault();
    try {
      await api.post('/villages', {
        name,
        pin_code: pinCode,
        population: population ? parseInt(population) : null,
        households: households ? parseInt(households) : null,
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
        has_school: hasSchool,
        has_health_centre: hasHealth,
      });
      showSuccess('Village added successfully');
      setShowModal(false);
      setName('');
      fetchVillages();
    } catch (err) {
      showError('Failed to add village');
    }
  };

  const handleDeleteVillage = async (id) => {
    if (!window.confirm('Delete village entry?')) return;
    try {
      await api.delete(`/villages/${id}`);
      showSuccess('Village deleted');
      fetchVillages();
    } catch (err) {
      showError('Delete failed');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Village Directory Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>CRUD management of Tehsil villages, demographics, map coordinates, and infrastructure.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-accent">
          <Plus size={18} /> Add Village
        </button>
      </div>

      <div className="card card-body">
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Village Name</th>
                  <th>PIN</th>
                  <th>Population</th>
                  <th>Coordinates (Lat, Lng)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {villages.map((v) => (
                  <tr key={v.id}>
                    <td>#{v.id}</td>
                    <td><strong>{v.name}</strong></td>
                    <td>{v.pin_code || 'N/A'}</td>
                    <td>{v.population || 'N/A'}</td>
                    <td>{v.latitude && v.longitude ? `${v.latitude}, ${v.longitude}` : 'No coordinates'}</td>
                    <td>
                      <button onClick={() => handleDeleteVillage(v.id)} className="btn btn-sm btn-danger">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Village to Tehsil">
        <form onSubmit={handleCreateVillage}>
          <div className="form-group">
            <label className="form-label">Village Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Nashik Village Alpha" />
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">PIN Code</label>
              <input type="text" className="form-input" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="e.g. 422001" />
            </div>

            <div className="form-group">
              <label className="form-label">Population</label>
              <input type="number" className="form-input" value={population} onChange={(e) => setPopulation(e.target.value)} placeholder="e.g. 2500" />
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input type="number" step="any" className="form-input" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 19.9975" />
            </div>

            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input type="number" step="any" className="form-input" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="e.g. 73.7898" />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={hasSchool} onChange={(e) => setHasSchool(e.target.checked)} /> Has School
            </label>
            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={hasHealth} onChange={(e) => setHasHealth(e.target.checked)} /> Has Health Centre
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full">Add Village</button>
        </form>
      </Modal>
    </div>
  );
}
