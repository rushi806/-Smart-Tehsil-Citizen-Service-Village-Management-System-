import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { Award, Printer, Download, CheckSquare, ShieldAlert } from 'lucide-react';

export default function Documents() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('service_id') || '');
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      setLoading(true);
      api.get(`/services/${selectedServiceId}`)
        .then((res) => setSelectedService(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSelectedService(null);
    }
  }, [selectedServiceId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Smart Document Checklist Generator</h1>
          <p>Select your required Tehsil certificate service to generate an official document checklist.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        
        {/* Selection Card */}
        <div className="card card-body mb-6" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600' }}>Select Government Service:</label>
          <select
            className="form-input"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
          >
            <option value="">-- Choose a Service --</option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.name} (Fee: ₹{svc.fees})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : selectedService ? (
          <div className="card card-body" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff' }}>
            
            {/* Header for print */}
            <div style={{ borderBottom: '2px solid var(--primary-800)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tehsil Office Official Service Portal</div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Required Document Checklist</h2>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--accent-600)', marginTop: '0.2rem' }}>
                  Service: {selectedService.name}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handlePrint} className="btn btn-sm btn-primary">
                  <Printer size={16} /> Print Checklist
                </button>
              </div>
            </div>

            {/* Warning banner */}
            <div className="alert alert-warning mb-6">
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Official Notice:</strong> Requirements listed below are managed in accordance with official Tehsil rules. Ensure all documents are clear, legible, and self-attested before submission.
              </div>
            </div>

            {/* Meta Table */}
            <div className="grid grid-3 mb-6" style={{ gap: '1rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department</div>
                <div style={{ fontWeight: '600' }}>{selectedService.department_name || 'Revenue Department'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Government Fee</div>
                <div style={{ fontWeight: '600', color: 'var(--green-700)' }}>₹{selectedService.fees}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processing Time</div>
                <div style={{ fontWeight: '600' }}>{selectedService.processing_time_days} Working Days</div>
              </div>
            </div>

            {/* Checklist */}
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Checklist of Mandatory & Supporting Documents:</h3>
            
            {selectedService.required_documents && selectedService.required_documents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {selectedService.required_documents.map((doc, idx) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: '2px solid var(--gray-400)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginTop: '2px', flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                        {idx + 1}. {doc.document_name}
                        {doc.is_mandatory ? (
                          <span className="badge badge-red" style={{ marginLeft: '0.75rem' }}>Mandatory</span>
                        ) : (
                          <span className="badge badge-gray" style={{ marginLeft: '0.75rem' }}>Optional</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Accepted Formats: {doc.accepted_formats} (Max {doc.max_size_mb}MB)
                      </div>
                      {doc.notes && <div style={{ fontSize: '0.8rem', color: 'var(--accent-600)', marginTop: '0.25rem' }}>Note: {doc.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No document requirements registered for this service yet.</p>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Generated on {new Date().toLocaleDateString()} via Smart Tehsil Citizen Service Portal.
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <CheckSquare size={54} />
            <h3>Select a Service Above</h3>
            <p>Choose any certificate or service to instantly generate its official required documents checklist.</p>
          </div>
        )}
      </div>
    </div>
  );
}
