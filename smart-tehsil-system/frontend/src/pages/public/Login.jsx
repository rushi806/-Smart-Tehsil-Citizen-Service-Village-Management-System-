import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      showSuccess(`Welcome back, ${user.full_name}!`);

      // Route to correct dashboard by role
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'officer') navigate('/officer/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err) {
      showError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card card-body" style={{ width: '100%', maxWidth: '440px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Portal Login</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Sign in to your Citizen, Staff, Officer, or Admin account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mb-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Quick Demo Login Credentials:
          </div>
          <div className="flex gap-2 flex-wrap mb-2">
            <button onClick={() => fillDemo('admin@tehsil.gov.in', 'Admin@123')} className="btn btn-sm btn-secondary" style={{ fontSize: '0.75rem' }}>Admin</button>
            <button onClick={() => fillDemo('officer@tehsil.gov.in', 'Officer@123')} className="btn btn-sm btn-secondary" style={{ fontSize: '0.75rem' }}>Officer</button>
            <button onClick={() => fillDemo('staff@tehsil.gov.in', 'Staff@123')} className="btn btn-sm btn-secondary" style={{ fontSize: '0.75rem' }}>Staff</button>
            <button onClick={() => fillDemo('citizen@example.com', 'Citizen@123')} className="btn btn-sm btn-secondary" style={{ fontSize: '0.75rem' }}>Citizen</button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have a citizen account? <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Register Here</Link>
        </div>

      </div>
    </div>
  );
}
