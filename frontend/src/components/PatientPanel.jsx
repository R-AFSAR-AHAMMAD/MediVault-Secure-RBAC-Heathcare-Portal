import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

// Sub-component for Booking
const BookAppointment = () => {
  const [docs, setDocs] = useState([]);
  const [book, setBook] = useState({ doctorId: '', symptoms: '' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/doctors').then(r => setDocs(r.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/book', book);
      alert('Appointment Booked!');
      navigate('/patient/history'); // Redirect to history after booking
    } catch (err) {
      alert('Booking failed');
    }
  };

  return (
    <div className="mb-6 border p-4 rounded bg-gray-50">
      <h3 className="font-bold mb-2">Book Appointment</h3>
      <form onSubmit={submit}>
        <select className="border p-2 w-full mb-2" onChange={e => setBook({...book, doctorId: e.target.value})} required>
          <option value="">Select Doctor</option>
          {docs.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
        </select>
        <textarea className="border p-2 w-full mb-2" placeholder="Symptoms" onChange={e => setBook({...book, symptoms: e.target.value})} required />
        <button type="submit" className="bg-teal-600 text-white p-2 rounded w-full">Confirm Booking</button>
      </form>
    </div>
  );
};

// Sub-component for History
const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/appointments').then(r => setHistory(r.data));
  }, []);

  return (
    <div>
      <h3 className="font-bold mb-4">Medical History</h3>
      {history.length === 0 && <p className="text-gray-500">No records found.</p>}
      {history.map(h => (
        <div key={h._id} className="border p-4 my-2 rounded bg-white shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-lg">Dr. {h.doctorName}</p>
              <p className="text-gray-600 text-sm">Symptoms: {h.symptoms}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${h.status==='treated'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-700'}`}>
                {h.status}
              </span>
              <p className="text-xs text-gray-400 mt-1">{new Date(h.date).toLocaleDateString()}</p>
            </div>
          </div>
          {h.status === 'treated' && (
            <div className="mt-2 pt-2 border-t text-sm bg-slate-50 p-2 rounded">
              <p><strong>Dx:</strong> {h.diagnosis}</p>
              <p><strong>Rx:</strong> {h.prescription}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main Patient Layout
export default function PatientPanel() {
  const location = useLocation();
  const isBooking = location.pathname.includes('book');

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Patient Portal</h2>
        <div className="flex gap-2">
          <Link to="/patient/history" className={`px-4 py-2 rounded ${!isBooking ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>
            History
          </Link>
          <Link to="/patient/book" className={`px-4 py-2 rounded ${isBooking ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>
            New Consultation
          </Link>
        </div>
      </div>

      <Routes>
        <Route path="history" element={<History />} />
        <Route path="book" element={<BookAppointment />} />
        {/* Default to history if just /patient */}
        <Route path="/" element={<History />} />
      </Routes>
    </div>
  );
}