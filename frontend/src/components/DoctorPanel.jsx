import { useState, useEffect } from 'react';
import api from '../api';

export default function DoctorPanel() {
  const [appts, setAppts] = useState([]);
  const [rx, setRx] = useState({ diagnosis: '', prescription: '' });

  useEffect(() => { api.get('/appointments').then(r => setAppts(r.data)) }, []);

  const treat = (id) => api.put(`/treat/${id}`, rx).then(() => window.location.reload());

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>
      {appts.map(a => (
        <div key={a._id} className="border p-4 mb-2 rounded bg-white shadow">
          <p className="font-bold">{a.patientName}</p>
          <p className="text-gray-600">Symptoms: {a.symptoms}</p>
          {a.status === 'pending' ? (
            <div className="mt-2">
              <input className="border p-1 mr-2" placeholder="Diagnosis" onChange={e => setRx({...rx, diagnosis: e.target.value})} />
              <input className="border p-1 mr-2" placeholder="Prescription" onChange={e => setRx({...rx, prescription: e.target.value})} />
              <button onClick={() => treat(a._id)} className="bg-green-500 text-white px-3 py-1 rounded">Treat</button>
            </div>
          ) : <span className="text-green-600 font-bold">Treated</span>}
        </div>
      ))}
    </div>
  );
}