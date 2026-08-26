import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Volume2, Plus, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('NOTICE');
  const [priority, setPriority] = useState('NORMAL');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    setLoading(true);
    api.get('/notices')
      .then((res) => setNotices(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices', {
        title,
        description,
        category,
        priority,
        is_published: true,
      });
      showSuccess('Notice published successfully');
      setShowModal(false);
      setTitle('');
      setDescription('');
      fetchNotices();
    } catch (err) {
      showError('Failed to publish notice');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      showSuccess('Notice deleted');
      fetchNotices();
    } catch (err) {
      showError('Failed to delete notice');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Notice & Announcement Publishing</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Publish official circulars, camp announcements, holidays, and deadlines.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-accent">
          <Plus size={18} /> Publish Notice
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
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Published Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((n) => (
                  <tr key={n.id}>
                    <td>#{n.id}</td>
                    <td><strong>{n.title}</strong></td>
                    <td><span className="badge badge-orange">{n.category}</span></td>
                    <td><span className={`badge ${n.priority === 'HIGH' ? 'badge-red' : 'badge-blue'}`}>{n.priority}</span></td>
                    <td>{new Date(n.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDeleteNotice(n.id)} className="btn btn-sm btn-danger">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Publish Official Notice">
        <form onSubmit={handleCreateNotice}>
          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Document Verification Camp" />
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="NOTICE">Notice</option>
                <option value="CIRCULAR">Circular</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="DEADLINE">Deadline</option>
                <option value="CAMP">Camp</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Description / Notice Body</label>
            <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
          </div>

          <button type="submit" className="btn btn-primary w-full">Publish Notice</button>
        </form>
      </Modal>
    </div>
  );
}
