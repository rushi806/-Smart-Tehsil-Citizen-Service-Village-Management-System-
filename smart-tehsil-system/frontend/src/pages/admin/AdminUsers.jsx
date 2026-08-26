import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, UserPlus, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = () => {
    setLoading(true);
    let url = '/users?';
    if (roleFilter) url += `role=${roleFilter}&`;
    api.get(url)
      .then((res) => setUsers(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', {
        full_name: fullName,
        email,
        phone,
        password,
        role,
      });
      showSuccess(`User ${email} created successfully`);
      setShowModal(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to create user');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.patch(`/users/${userId}/toggle-active`);
      showSuccess('User status updated');
      fetchUsers();
    } catch (err) {
      showError('Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${userId}`);
      showSuccess('User deleted');
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.detail || 'Delete failed');
    }
  };

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>User Management</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage citizens, staff, officers, and admin accounts.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-accent">
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="card card-body mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="search-box" style={{ flex: 1, minWidth: '280px' }}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '0.9rem', padding: '0.625rem 1rem 0.625rem 2.5rem' }}
          />
        </div>

        <select
          className="form-input"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ width: 'auto', marginBottom: 0 }}
        >
          <option value="">All Roles</option>
          <option value="citizen">Citizen</option>
          <option value="staff">Staff</option>
          <option value="officer">Officer</option>
          <option value="admin">Admin</option>
        </select>
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
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.full_name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-blue">{u.role}</span></td>
                    <td>
                      <button onClick={() => handleToggleActive(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {u.is_active ? <ToggleRight size={28} style={{ color: 'var(--green-600)' }} /> : <ToggleLeft size={28} style={{ color: 'var(--gray-400)' }} />}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteUser(u.id)} className="btn btn-sm btn-danger">
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New User Account">
        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Assign Role</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="citizen">Citizen</option>
              <option value="staff">Staff</option>
              <option value="officer">Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">Create User</button>
        </form>
      </Modal>
    </div>
  );
}
