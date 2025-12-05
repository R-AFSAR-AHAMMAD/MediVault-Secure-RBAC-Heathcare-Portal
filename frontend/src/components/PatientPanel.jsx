import { useState, useEffect } from 'react';
import api from '../api';

export default function PatientPanel() {
  const [docs, setDocs] = useState([]);
  const [history, setHistory] = useState([]);
  const [book, setBook] = useState({ doctorId: '', symptoms: '' });

  useEffect(() => {
    api.get('/doctors').then(r => setDocs(r.data));
    api.get('/appointments').then(r => setHistory(r.data));
  }, []);

  const submit = () => api.post('/book', book).then(() => window.location.reload());

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Patient Portal</h2>
      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="font-bold mb-2">Book Appointment</h3>
        <select className="border p-2 w-full mb-2" onChange={e => setBook({...book, doctorId: e.target.value})}>
          <option>Select Doctor</option>
          {docs.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
        </select>
        <textarea className="border p-2 w-full mb-2" placeholder="Symptoms" onChange={e => setBook({...book, symptoms: e.target.value})} />
        <button onClick={submit} className="bg-teal-600 text-white p-2 rounded w-full">Book</button>
      </div>
      <div>
        <h3 className="font-bold">History</h3>
        {history.map(h => (
          <div key={h._id} className="border p-3 my-2 rounded">
            <p>Dr. {h.doctorName} - <span className={h.status==='treated'?'text-green-500':'text-orange-500'}>{h.status}</span></p>
            {h.status === 'treated' && <p className="text-sm">Rx: {h.prescription}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}