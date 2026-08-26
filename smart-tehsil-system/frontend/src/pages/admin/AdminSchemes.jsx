import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Award, Plus, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [benefits, setBenefits] = useState('');
  const [category, setCategory] = useState('farmer');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = () => {
    setLoading(true);
    api.get('/schemes')
      .then((res) => setSchemes(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      await api.post('/schemes', {
        name,
        description,
        eligibility,
        benefits,
        category,
      });
      showSuccess('Government scheme added');
      setShowModal(false);
      setName('');
      fetchSchemes();
    } catch (err) {
      showError('Failed to add scheme');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Deactivate scheme?')) return;
    try {
      await api.delete(`/schemes/${id}`);
      showSuccess('Scheme deactivated');
      fetchSchemes();
    } catch (err) {
      showError('Failed to deactivate scheme');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Government Schemes Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Publish and update official government schemes, benefits, and eligibility guidelines.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-accent">
          <Plus size={18} /> Add New Scheme
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
                  <th>Scheme Name</th>
                  <th>Category</th>
                  <th>Benefits</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((sc) => (
                  <tr key={sc.id}>
                    <td>#{sc.id}</td>
                    <td><strong>{sc.name}</strong></td>
                    <td><span className="badge badge-orange">{sc.category}</span></td>
                    <td>{sc.benefits || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleDeleteScheme(sc.id)} className="btn btn-sm btn-danger">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Government Welfare Scheme">
        <form onSubmit={handleCreateScheme}>
          <div className="form-group">
            <label className="form-label">Scheme Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. PM Kisan Samman Nidhi" />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="farmer">Farmer</option>
              <option value="student">Student</option>
              <option value="women">Women</option>
              <option value="housing">Housing</option>
              <option value="senior">Senior Citizen</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Benefits</label>
            <input type="text" className="form-input" value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="e.g. Financial support ₹6000/year" />
          </div>

          <button type="submit" className="btn btn-primary w-full">Save Scheme</button>
        </form>
      </Modal>
    </div>
  );
}
