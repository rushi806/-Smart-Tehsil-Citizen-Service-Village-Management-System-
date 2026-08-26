import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FileText, Plus, Trash2, Edit } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [fees, setFees] = useState(20);
  const [days, setDays] = useState(7);
  const [deptId, setDeptId] = useState('');
  const [category, setCategory] = useState('Revenue');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchServices();
    api.get('/departments').then((res) => setDepartments(res.data || [])).catch(console.error);
  }, []);

  const fetchServices = () => {
    setLoading(true);
    api.get('/services')
      .then((res) => setServices(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', {
        name,
        description,
        eligibility,
        fees: parseFloat(fees),
        processing_time_days: parseInt(days),
        department_id: deptId ? parseInt(deptId) : null,
        category,
      });
      showSuccess('Service created successfully');
      setShowModal(false);
      setName('');
      setDescription('');
      fetchServices();
    } catch (err) {
      showError('Failed to create service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Deactivate service?')) return;
    try {
      await api.delete(`/services/${id}`);
      showSuccess('Service deactivated');
      fetchServices();
    } catch (err) {
      showError('Delete failed');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Service Directory CRUD Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Add, edit, and configure official Tehsil services, fees, and processing times.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-accent">
          <Plus size={18} /> Add New Service
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
                  <th>Service Name</th>
                  <th>Department</th>
                  <th>Fee (₹)</th>
                  <th>Days</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.department_name || 'Revenue'}</td>
                    <td>₹{s.fees}</td>
                    <td>{s.processing_time_days} days</td>
                    <td><span className="badge badge-blue">{s.category}</span></td>
                    <td>
                      <button onClick={() => handleDeleteService(s.id)} className="btn btn-sm btn-danger">
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Tehsil Service">
        <form onSubmit={handleCreateService}>
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Income Certificate" />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Revenue">Revenue</option>
              <option value="Social Welfare">Social Welfare</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" value={deptId} onChange={(e) => setDeptId(e.target.value)}>
              <option value="">-- Select Dept --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Government Fee (₹)</label>
              <input type="number" className="form-input" value={fees} onChange={(e) => setFees(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Processing Time (Days)</label>
              <input type="number" className="form-input" value={days} onChange={(e) => setDays(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Description</label>
            <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Eligibility Criteria</label>
            <input type="text" className="form-input" value={eligibility} onChange={(e) => setEligibility(e.target.value)} placeholder="e.g. Resident of Tehsil" />
          </div>

          <button type="submit" className="btn btn-primary w-full">Create Service</button>
        </form>
      </Modal>
    </div>
  );
}
