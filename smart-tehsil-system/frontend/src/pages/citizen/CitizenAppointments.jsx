import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, CheckCircle, Plus } from 'lucide-react';

export default function CitizenAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchAppointments();
    api.get('/departments').then((res) => setDepartments(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedDept && selectedDate) {
      api.get(`/appointments/slots?department_id=${selectedDept}&slot_date=${selectedDate}`)
        .then((res) => setSlots(res.data || []))
        .catch(console.error);
    }
  }, [selectedDept, selectedDate]);

  const fetchAppointments = () => {
    api.get('/appointments')
      .then((res) => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    setBooking(true);
    try {
      await api.post('/appointments', {
        department_id: parseInt(selectedDept),
        time_slot_id: parseInt(selectedSlotId),
        purpose,
      });
      showSuccess('Appointment booked successfully!');
      setSelectedSlotId('');
      setPurpose('');
      fetchAppointments();
    } catch (err) {
      showError(err.response?.data?.detail || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-900)' }}>Tehsil Office Appointments</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Book an appointment slot to visit the Tehsil desk without waiting in line.</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ gap: '2rem' }}>
        
        {/* Booking Form */}
        <div>
          <div className="card card-body">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Book New Slot</h3>
            
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Select Department <span className="required">*</span></label>
                <select
                  className="form-input"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  required
                >
                  <option value="">-- Choose Dept --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Date <span className="required">*</span></label>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              {slots.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Available Time Slots <span className="required">*</span></label>
                  <select
                    className="form-input"
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Time Slot --</option>
                    {slots.map((s) => (
                      <option key={s.id} value={s.id} disabled={s.status !== 'AVAILABLE'}>
                        {s.start_time} - {s.end_time} ({s.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Purpose of Visit</label>
                <input
                  type="text"
                  className="form-input"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Document verification"
                />
              </div>

              <button type="submit" className="btn btn-accent w-full" disabled={booking || !selectedSlotId}>
                {booking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Appointments */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card card-body">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>My Booked Appointments</h3>
            
            {loading ? (
              <div className="loading-spinner"><div className="spinner"></div></div>
            ) : appointments.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <Calendar size={36} />
                <p>No active appointments.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Appointment ID</th>
                      <th>Department</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id}>
                        <td><strong>{apt.appointment_id}</strong></td>
                        <td>{apt.department_name}</td>
                        <td>{apt.slot_date} ({apt.slot_start_time} - {apt.slot_end_time})</td>
                        <td><span className={`badge status-${apt.status}`}>{apt.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
