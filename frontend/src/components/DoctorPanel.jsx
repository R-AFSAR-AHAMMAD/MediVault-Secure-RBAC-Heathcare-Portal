import { useState, useEffect } from 'react';
import api from '../api';

export default function DoctorPanel() {
  const [appts, setAppts] = useState([]);
  const [rx, setRx] = useState({ diagnosis: '', prescription: '' });

  useEffect(() => { api.get('/appointments').then(r => setAppts(r.data)) }, []);

  const treat = (id) => api.put(`/treat/${id}`, rx).then(() => window.location.reload());

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Doctor Dashboard</h2>
      <div className="grid gap-6">
        {appts.length === 0 && <div className="text-center py-10 text-slate-500">No appointments scheduled.</div>}
        
        {appts.map(a => (
          <div key={a._id} className={`bg-white rounded-xl shadow-sm border ${a.status === 'treated' ? 'border-l-4 border-l-green-500 border-slate-200' : 'border-l-4 border-l-blue-500 border-blue-100'} overflow-hidden`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-lg font-bold text-slate-800">{a.patientName}</h3>
                    <p className="text-slate-500 text-sm">Symptoms reported:</p>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${a.status==='treated'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>
                    {a.status}
                 </span>
              </div>
              
              <p className="mt-2 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                "{a.symptoms}"
              </p>

              {a.status === 'pending' ? (
                <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-3 text-sm uppercase">Treatment Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input className="border border-slate-300 p-2.5 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Diagnosis" onChange={e => setRx({...rx, diagnosis: e.target.value})} />
                    <input className="border border-slate-300 p-2.5 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Prescription" onChange={e => setRx({...rx, prescription: e.target.value})} />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => treat(a._id)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium shadow-sm transition">
                        Complete Treatment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-6">
                    <div>
                        <span className="text-xs text-slate-500 uppercase font-bold">Diagnosis</span>
                        <p className="text-slate-800">{a.diagnosis}</p>
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 uppercase font-bold">Prescription</span>
                        <p className="text-slate-800">{a.prescription}</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}