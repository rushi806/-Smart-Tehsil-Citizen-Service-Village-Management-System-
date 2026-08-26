import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

export default function AdminAIKB() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [topic, setTopic] = useState('');
  const [patterns, setPatterns] = useState('');
  const [answerEn, setAnswerEn] = useState('');
  const [answerHi, setAnswerHi] = useState('');
  const [answerMr, setAnswerMr] = useState('');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchKB();
  }, []);

  const fetchKB = () => {
    setLoading(true);
    api.get('/ai-knowledge')
      .then((res) => setEntries(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ai-knowledge', {
        topic,
        question_patterns: patterns.split(',').map((p) => p.trim()),
        answer_en: answerEn,
        answer_hi: answerHi || null,
        answer_mr: answerMr || null,
        category: 'services',
      });
      showSuccess('AI Knowledge Base entry added');
      setShowModal(false);
      setTopic('');
      setAnswerEn('');
      fetchKB();
    } catch (err) {
      showError('Failed to add KB entry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete entry?')) return;
    try {
      await api.delete(`/ai-knowledge/${id}`);
      showSuccess('KB entry deleted');
      fetchKB();
    } catch (err) {
      showError('Failed to delete KB entry');
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>AI Assistant Knowledge Base</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage verified rule-based knowledge rules to prevent AI hallucination of legal rules or fees.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-accent">
          <Plus size={18} /> Add KB Entry
        </button>
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
                  <th>Topic</th>
                  <th>Trigger Patterns</th>
                  <th>English Answer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td><strong>{item.topic}</strong></td>
                    <td><div style={{ fontSize: '0.8rem' }}>{item.question_patterns?.join(', ')}</div></td>
                    <td><div style={{ fontSize: '0.8rem', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.answer_en}</div></td>
                    <td>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Verified AI Knowledge Base Entry">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Topic / Service Name</label>
            <input type="text" className="form-input" value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="e.g. Income Certificate" />
          </div>

          <div className="form-group">
            <label className="form-label">Trigger Question Patterns (Comma separated)</label>
            <input type="text" className="form-input" value={patterns} onChange={(e) => setPatterns(e.target.value)} required placeholder="e.g. income documents, aay praman, utpanna dakhala" />
          </div>

          <div className="form-group">
            <label className="form-label">Official Answer (English)</label>
            <textarea className="form-input" value={answerEn} onChange={(e) => setAnswerEn(e.target.value)} required rows={3} />
          </div>

          <div className="form-group">
            <label className="form-label">Official Answer (Hindi - Optional)</label>
            <textarea className="form-input" value={answerHi} onChange={(e) => setAnswerHi(e.target.value)} rows={2} />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Official Answer (Marathi - Optional)</label>
            <textarea className="form-input" value={answerMr} onChange={(e) => setAnswerMr(e.target.value)} rows={2} />
          </div>

          <button type="submit" className="btn btn-primary w-full">Save Knowledge Rule</button>
        </form>
      </Modal>
    </div>
  );
}
