import React, { useState } from 'react';
import api from '../../services/api';
import { Search, Clock, CheckCircle, FileText, AlertCircle } from 'lucide-react';

export default function TrackApplication() {
  const [appNumber, setAppNumber] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!appNumber.trim()) return;

    setLoading(true);
    setError(null);
    setApplication(null);

    try {
      const res = await api.get(`/applications/track/${appNumber.trim()}`);
      setApplication(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Application not found. Please check your application ID.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'DOCUMENT_VERIFICATION', label: 'Document Verification' },
    { key: 'UNDER_REVIEW', label: 'Officer Review' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'COMPLETED', label: 'Certificate Issued' },
  ];

  const getStepIndex = (status) => {
    if (status === 'REJECTED') return -1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Track Application Status</h1>
          <p>Enter your unique Application ID (e.g. INC-2026-000123) to check real-time progress.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '800px' }}>
        
        <div className="card card-body mb-6">
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="search-box" style={{ flex: 1 }}>
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Enter Application ID (e.g. INC-2026-000123)..."
                value={appNumber}
                onChange={(e) => setAppNumber(e.target.value)}
                style={{ fontSize: '1rem', padding: '0.75rem 1rem 0.75rem 2.5rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Tracking...' : 'Track Application'}
            </button>
          </form>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle size={20} />
            <div>{error}</div>
          </div>
        )}

        {application && (
          <div className="card card-body">
            
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Application Number</div>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>{application.application_number}</h2>
              </div>
              <span className={`badge status-${application.status}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.875rem' }}>
                Status: {application.status}
              </span>
            </div>

            <div className="grid grid-2 mb-6" style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', gap: '1rem', fontSize: '0.875rem' }}>
              <div><strong>Service:</strong> {application.service_name}</div>
              <div><strong>Applicant:</strong> {application.applicant_name}</div>
              <div><strong>Submission Date:</strong> {new Date(application.submitted_at).toLocaleDateString()}</div>
              <div><strong>Remarks:</strong> {application.remarks || 'None'}</div>
            </div>

            {/* Application Progress Stepper */}
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Progress Timeline:</h3>
            <div className="timeline">
              {application.timeline && application.timeline.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot done">✓</div>
                  <div className="timeline-content">
                    <h4>{item.status}</h4>
                    <p>{item.note}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
