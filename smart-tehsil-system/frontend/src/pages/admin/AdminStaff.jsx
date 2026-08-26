import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Plus, Trash2, Edit } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminStaff() {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [userId, setUserId] = useState('');
  const [deptId, setDeptId] = useState('');
  const [designation, setDesignation] = useState('');
  const [room, setRoom] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchStaff();
    api.get('/departments').then((res) => setDepartments(res.data || [])).catch(console.error);
  }, []);

  const fetchStaff = () => {
    setLoading(true);
    api.get('/staff?public_only=false')
      .then((res) => setStaffList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/staff', {
        user_id: parseInt(userId),
        department_id: deptId ? parseInt(deptId) : null,
        designation,
        office_room: room,
        official_phone: phone,
        official_email: email,
      });
      showSuccess('Staff profile assigned successfully');
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to create staff');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Delete staff profile?')) return;
    try {
      await api.delete(`/staff/${id}`);
      showSuccess('Staff profile deleted');
      fetchStaff();
    } catch (err) {
      showError('Failed to delete staff');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Staff & Officers Directory Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Assign staff profiles, designations, office rooms, and department links.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-accent">
          <Plus size={18} /> Assign Staff Profile
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
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Room</th>
                  <th>Live Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td><strong>{s.user_full_name}</strong></td>
                    <td>{s.designation}</td>
                    <td>{s.department_name || 'N/A'}</td>
                    <td>{s.office_room || 'Main Hall'}</td>
                    <td><span className={`badge status-${s.status}`}>● {s.status}</span></td>
                    <td>
                      <button onClick={() => handleDeleteStaff(s.id)} className="btn btn-sm btn-danger">
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Assign Staff Profile to User">
        <form onSubmit={handleCreateStaff}>
          <div className="form-group">
            <label className="form-label">User ID (Existing User)</label>
            <input type="number" className="form-input" value={userId} onChange={(e) => setUserId(e.target.value)} required placeholder="Enter User ID (e.g. 3)" />
          </div>

          <div className="form-group">
            <label className="form-label">Designation</label>
            <input type="text" className="form-input" value={designation} onChange={(e) => setDesignation(e.target.value)} required placeholder="e.g. Talathi" />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-input" value={deptId} onChange={(e) => setDeptId(e.target.value)}>
              <option value="">-- Choose Dept --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Office Room</label>
            <input type="text" className="form-input" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 101" />
          </div>

          <div className="form-group">
            <label className="form-label">Official Phone</label>
            <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary w-full">Save Staff Profile</button>
        </form>
      </Modal>
    </div>
  );
}
