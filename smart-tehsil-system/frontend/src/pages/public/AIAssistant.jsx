import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import { Send, Mic, MicOff, Bot, User, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Smart Tehsil AI Assistant. Ask me about required documents, fees, eligibility, or office hours for any certificate or service.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend = input) => {
    const query = textToSend.trim();
    if (!query || loading) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: query, language });
      const botMsg = {
        sender: 'bot',
        text: res.data.reply,
        source: res.data.source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, I am having trouble answering right now. Please verify with the concerned Tehsil office.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Voice input using browser Web Speech API
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please use Chrome/Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const sampleQuestions = [
    'What documents are required for income certificate?',
    'What is the eligibility for caste certificate?',
    'What are the working hours of the Tehsil office?',
    'How do I apply for domicile certificate?',
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={24} style={{ color: 'var(--accent-400)' }} />
            <h1 style={{ margin: 0 }}>Smart AI Tehsil Assistant</h1>
          </div>
          <p>Verified service guidance strictly backed by the Tehsil Knowledge Base.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
        
        {/* Verification Warning */}
        <div className="alert alert-warning mb-4" style={{ fontSize: '0.8125rem' }}>
          <ShieldAlert size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Verified AI Safety Guarantee:</strong> Answers are retrieved strictly from verified Tehsil office knowledge rules. The AI does NOT invent official fees or rules. Always verify with official Tehsil staff.
          </div>
        </div>

        {/* Chat Card */}
        <div className="chat-container">
          
          {/* Header controls */}
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center gap-2">
              <Bot size={20} style={{ color: 'var(--primary-600)' }} />
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Tehsil AI Guidance Assistant</span>
            </div>

            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginBottom: 0 }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>
          </div>

          {/* Messages Window */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                <div>{msg.text}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '0.25rem' }}>
                  {msg.time}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={14} className="spinner" /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts */}
          <div style={{ padding: '0.5rem 1rem', background: 'var(--gray-50)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  background: '#fff',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                💡 {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chat-input-row"
          >
            <button
              type="button"
              onClick={startVoiceInput}
              className={`btn btn-icon ${isListening ? 'btn-danger' : 'btn-secondary'}`}
              title="Voice Input"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              className="form-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Type your question... (e.g. Income certificate documents)'}
              style={{ marginBottom: 0 }}
            />

            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
