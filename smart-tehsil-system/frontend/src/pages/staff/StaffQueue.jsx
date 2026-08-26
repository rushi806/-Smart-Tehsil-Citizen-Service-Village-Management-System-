import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Ticket, Play, CheckCircle, SkipForward } from 'lucide-react';

export default function StaffQueue() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    api.get('/departments').then((res) => {
      setDepartments(res.data || []);
      if (res.data.length > 0) setSelectedDept(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedDept) fetchQueue();
  }, [selectedDept]);

  const fetchQueue = () => {
    setLoading(true);
    api.get(`/tokens/queue/${selectedDept}`)
      .then((res) => setQueue(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCallToken = async (tokenId) => {
    try {
      await api.patch(`/tokens/${tokenId}/call`);
      showSuccess('Called next token!');
      fetchQueue();
    } catch (err) {
      showError('Failed to call token');
    }
  };

  const handleCompleteToken = async (tokenId) => {
    try {
      await api.patch(`/tokens/${tokenId}/complete`);
      showSuccess('Completed token service');
      fetchQueue();
    } catch (err) {
      showError('Failed to complete token');
    }
  };

  const handleSkipToken = async (tokenId) => {
    try {
      await api.patch(`/tokens/${tokenId}/skip`);
      showSuccess('Token skipped');
      fetchQueue();
    } catch (err) {
      showError('Failed to skip token');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Live Desk Token Queue Operator</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Call, serve, and complete waiting citizen tokens for your counter.</p>
        </div>
      </div>

      <div className="card card-body mb-6">
        <label className="form-label" style={{ fontWeight: '600' }}>Select Desk Counter:</label>
        <select
          className="form-input"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{ maxWidth: '400px', marginBottom: 0 }}
        >
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name} ({d.location})</option>
          ))}
        </select>
      </div>

      <div className="card card-body">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Queue</h3>
        
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : queue.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <Ticket size={36} />
            <p>No tokens waiting in queue for this desk.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Citizen Name</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((t) => (
                  <tr key={t.id}>
                    <td><strong style={{ fontSize: '1.1rem', color: 'var(--primary-700)' }}>{t.token_number}</strong></td>
                    <td>{t.citizen_name}</td>
                    <td>{t.purpose || 'General Service'}</td>
                    <td><span className={`badge status-${t.status}`}>{t.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        {t.status === 'WAITING' && (
                          <button onClick={() => handleCallToken(t.id)} className="btn btn-sm btn-accent">
                            <Play size={14} /> Call Next
                          </button>
                        )}
                        {t.status === 'CALLED' && (
                          <button onClick={() => handleCompleteToken(t.id)} className="btn btn-sm btn-primary">
                            <CheckCircle size={14} /> Complete
                          </button>
                        )}
                        <button onClick={() => handleSkipToken(t.id)} className="btn btn-sm btn-secondary">
                          <SkipForward size={14} /> Skip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
