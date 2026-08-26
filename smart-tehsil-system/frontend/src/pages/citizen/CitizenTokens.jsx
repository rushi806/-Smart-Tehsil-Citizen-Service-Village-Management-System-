import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Ticket, Clock, CheckCircle2 } from 'lucide-react';

export default function CitizenTokens() {
  const [tokens, setTokens] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchTokens();
    api.get('/departments').then((res) => setDepartments(res.data || [])).catch(console.error);
  }, []);

  const fetchTokens = () => {
    api.get('/tokens/my')
      .then((res) => setTokens(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;

    setGenerating(true);
    try {
      const res = await api.post('/tokens', {
        department_id: parseInt(selectedDept),
        purpose,
      });
      showSuccess(`Token generated! Number: ${res.data.token_number}`);
      setPurpose('');
      fetchTokens();
    } catch (err) {
      showError(err.response?.data?.detail || 'Token generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Digital Token Queue Manager</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Generate an instant digital token for today's office visit and monitor live queue position.</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: '2rem' }}>
        
        {/* Token Generator Card */}
        <div>
          <div className="card card-body">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Generate New Token</h3>
            
            <form onSubmit={handleGenerateToken}>
              <div className="form-group">
                <label className="form-label">Department Counter <span className="required">*</span></label>
                <select
                  className="form-input"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  required
                >
                  <option value="">-- Choose Counter --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.location || 'Hall'})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Purpose of Visit</label>
                <input
                  type="text"
                  className="form-input"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Certificate collection"
                />
              </div>

              <button type="submit" className="btn btn-accent w-full" disabled={generating || !selectedDept}>
                {generating ? 'Generating...' : 'Get Token'}
              </button>
            </form>
          </div>
        </div>

        {/* My Active Tokens */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card card-body">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>My Queue Tokens</h3>
            
            {loading ? (
              <div className="loading-spinner"><div className="spinner"></div></div>
            ) : tokens.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <Ticket size={36} />
                <p>No active tokens today.</p>
              </div>
            ) : (
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {tokens.map((t) => (
                  <div key={t.id} style={{ border: '2px solid var(--primary-200)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', background: '#fff', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Token Number</div>
                    <div style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-700)', fontFamily: 'Poppins, sans-serif' }}>
                      {t.token_number}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                      {t.department_name}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: '1px solid var(--border)', fontSize: '0.8rem' }}>
                      <span className={`badge status-${t.status}`}>Status: {t.status}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Wait: ~{t.estimated_wait_minutes} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
