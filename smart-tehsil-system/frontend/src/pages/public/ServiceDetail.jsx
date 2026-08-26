import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Clock, Award, ShieldCheck, Download, HelpCircle, ArrowLeft, Building, User } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/services/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => setError('Service not found or inactive'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (error || !service) return <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}><h2>{error || 'Service not found'}</h2><Link to="/services" className="btn btn-primary mt-4">Back to Services</Link></div>;

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <Link to="/services" style={{ color: 'var(--primary-200)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <h1>{service.name}</h1>
          <p>{service.department_name || 'Tehsil Office'}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div className="grid grid-3" style={{ gap: '2rem' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            {/* Overview Card */}
            <div className="card card-body mb-6">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Service Overview</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{service.description}</p>

              <div className="grid grid-2 mb-4" style={{ gap: '1rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)', fontWeight: '600' }}>Official Fee</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--green-700)' }}>₹{service.fees}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)', fontWeight: '600' }}>Processing Time</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-700)' }}>{service.processing_time_days} Working Days</div>
                </div>
              </div>

              {service.eligibility && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--primary-600)' }} /> Eligibility Criteria
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{service.eligibility}</p>
                </div>
              )}

              {service.application_procedure && (
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Application Procedure</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{service.application_procedure}</p>
                </div>
              )}
            </div>

            {/* Required Documents Card */}
            <div className="card card-body mb-6">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} style={{ color: 'var(--accent-500)' }} /> Required Documents Checklist
              </h2>

              {service.required_documents && service.required_documents.length > 0 ? (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {service.required_documents.map((doc) => (
                    <li key={doc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ color: 'var(--green-600)', fontWeight: 'bold' }}>✓</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '0.9375rem' }}>
                          {doc.document_name}
                          {doc.is_mandatory ? <span className="badge badge-red" style={{ marginLeft: '0.5rem' }}>Mandatory</span> : <span className="badge badge-gray" style={{ marginLeft: '0.5rem' }}>Optional</span>}
                        </div>
                        {doc.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{doc.notes}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No required documents listed yet.</p>
              )}
            </div>

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="card card-body">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={20} /> Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {service.faqs.map((faq) => (
                    <div key={faq.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.25rem' }}>Q: {faq.question}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div>
            <div className="card card-body mb-6">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Department & Contact</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div className="flex items-center gap-2">
                  <Building size={16} style={{ color: 'var(--primary-600)' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department</div>
                    <div style={{ fontWeight: '500' }}>{service.department_name || 'Revenue Department'}</div>
                  </div>
                </div>

                {service.responsible_designation && (
                  <div className="flex items-center gap-2">
                    <User size={16} style={{ color: 'var(--primary-600)' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Responsible Designation</div>
                      <div style={{ fontWeight: '500' }}>{service.responsible_designation}</div>
                    </div>
                  </div>
                )}

                {service.office_room && (
                  <div className="flex items-center gap-2">
                    <Building size={16} style={{ color: 'var(--primary-600)' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Office Room / Counter</div>
                      <div style={{ fontWeight: '500' }}>{service.office_room}</div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/citizen/applications/new" className="btn btn-accent w-full">
                  Apply Online Now
                </Link>
                <Link to={`/documents?service_id=${service.id}`} className="btn btn-outline w-full">
                  Generate PDF Checklist
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
