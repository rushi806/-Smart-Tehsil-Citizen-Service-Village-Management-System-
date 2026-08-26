import React, { useState } from 'react';
import api from '../../services/api';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

export default function TrackComplaint() {
  const [complaintNumber, setComplaintNumber] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!complaintNumber.trim()) return;

    setLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const res = await api.get(`/complaints/track/${complaintNumber.trim()}`);
      setComplaint(res.data);
    } catch (err) {
      setError('Complaint not found. Please verify your Complaint ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Track Complaint Status</h1>
          <p>Track your submitted grievance using your unique Complaint ID (e.g. CMP-2026-00001).</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '700px' }}>
        <div className="card card-body mb-6">
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              className="form-input"
              placeholder="Enter Complaint ID (e.g. CMP-2026-00001)..."
              value={complaintNumber}
              onChange={(e) => setComplaintNumber(e.target.value)}
              style={{ marginBottom: 0 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {error && <div className="alert alert-error mb-6">{error}</div>}

        {complaint && (
          <div className="card card-body">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complaint ID</div>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>{complaint.complaint_number}</h2>
              </div>
              <span className={`badge status-${complaint.status}`}>{complaint.status}</span>
            </div>

            <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Subject: {complaint.subject}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{complaint.description}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Submitted: {new Date(complaint.submitted_at).toLocaleString()}
              </div>
            </div>

            {complaint.resolution_note && (
              <div className="alert alert-success">
                <CheckCircle size={20} />
                <div>
                  <strong>Official Resolution Note:</strong>
                  <div>{complaint.resolution_note}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
