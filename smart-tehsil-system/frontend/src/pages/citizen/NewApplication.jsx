import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FileText, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function NewApplication() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [applicantAddress, setApplicantAddress] = useState('');
  const [purpose, setPurpose] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      api.get(`/services/${selectedServiceId}`)
        .then((res) => setSelectedService(res.data))
        .catch(console.error);
    } else {
      setSelectedService(null);
    }
  }, [selectedServiceId]);

  const handleFileChange = (docName, file) => {
    setUploadedFiles((prev) => ({ ...prev, [docName]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) {
      showError('Please select a service');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Application
      const appRes = await api.post('/applications', {
        service_id: parseInt(selectedServiceId),
        purpose,
        applicant_address: applicantAddress,
      });

      const app = appRes.data;

      // 2. Upload any selected documents
      for (const [docName, file] of Object.entries(uploadedFiles)) {
        if (file) {
          const formData = new FormData();
          formData.append('document_name', docName);
          formData.append('file', file);
          await api.post(`/applications/${app.id}/upload-document`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      showSuccess(`Application ${app.application_number} submitted successfully!`);
      navigate('/citizen/applications');
    } catch (err) {
      showError(err.response?.data?.detail || 'Application submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Apply for Tehsil Service</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Fill out application details and upload required verification documents.</p>
        </div>
      </div>

      <div className="card card-body" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group mb-6">
            <label className="form-label" style={{ fontSize: '1rem', fontWeight: '600' }}>Select Service <span className="required">*</span></label>
            <select
              className="form-input"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
              style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
            >
              <option value="">-- Select Certificate / Service --</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.name} (Fee: ₹{svc.fees} | {svc.processing_time_days} days)
                </option>
              ))}
            </select>
          </div>

          {selectedService && (
            <>
              <div className="alert alert-info mb-6">
                <div>
                  <strong>Official Fee: ₹{selectedService.fees}</strong> | Processing Time: {selectedService.processing_time_days} days
                  <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Department: {selectedService.department_name || 'Revenue Department'}</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Applicant Residential Address</label>
                <textarea
                  className="form-input"
                  value={applicantAddress}
                  onChange={(e) => setApplicantAddress(e.target.value)}
                  placeholder="Enter full postal address..."
                  rows={2}
                />
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Purpose of Certificate</label>
                <input
                  type="text"
                  className="form-input"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Admission / Scholarship / Employment"
                />
              </div>

              {/* Document Upload Section */}
              {selectedService.required_documents && selectedService.required_documents.length > 0 && (
                <div className="mb-6">
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Upload Required Documents (PDF, JPG, PNG):</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedService.required_documents.map((doc) => (
                      <div key={doc.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                            {doc.document_name} {doc.is_mandatory && <span style={{ color: 'red' }}>*</span>}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max {doc.max_size_mb}MB</span>
                        </div>

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(doc.document_name, e.target.files[0])}
                          className="form-input"
                          style={{ background: '#fff', fontSize: '0.875rem' }}
                          required={doc.is_mandatory}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn btn-accent w-full" disabled={loading || !selectedServiceId}>
            {loading ? 'Submitting Application...' : 'Submit Application'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
