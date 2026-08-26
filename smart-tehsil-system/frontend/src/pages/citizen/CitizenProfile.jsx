import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { User, Phone, MapPin, ShieldCheck, Key } from 'lucide-react';

export default function CitizenProfile() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/me', { full_name: fullName, phone, address });
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    try {
      await api.post('/auth/change-password', { current_password: currentPassword, new_password: newPassword });
      showSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Account Profile</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage your account settings and contact details.</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem', maxWidth: '900px' }}>
        
        {/* Profile Info */}
        <div className="card card-body">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Personal Information</h3>
          
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ background: 'var(--gray-100)' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Residential Address</label>
              <textarea
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card card-body">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Change Security Password</h3>
          
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-6">
              <label className="form-label">New Password (Min 8 chars)</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="btn btn-accent w-full" disabled={pwLoading}>
              {pwLoading ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
