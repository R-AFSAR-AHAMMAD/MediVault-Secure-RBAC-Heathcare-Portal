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
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">

      {/* Booking Column */}
      <div className="lg:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Patient Portal</h2>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-700 border-b pb-2">Book Appointment</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Choose Specialist</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white" onChange={e => setBook({...book, doctorId: e.target.value})}>
                <option>Select Doctor</option>
                {docs.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
              </select>
            </div>
            <div>
               <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Symptoms</label>
              <textarea className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-32 resize-none" placeholder="Describe how you feel..." onChange={e => setBook({...book, symptoms: e.target.value})} />
            </div>
            <button onClick={submit} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow-md transition">Book Appointment</button>
          </div>
        </div>
      </div>

      {/* History Column */}
      <div className="lg:col-span-2">
        <h3 className="font-bold text-xl mb-6 text-slate-800">Medical History</h3>
        <div className="space-y-4">
          {history.length === 0 && <p className="text-slate-500 italic">No medical records found.</p>}
          {history.map(h => (
            <div key={h._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <p className="font-bold text-slate-800 text-lg">Dr. {h.doctorName}</p>
                   <p className="text-slate-500 text-sm">{new Date(h.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${h.status==='treated' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {h.status}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg mt-3">
                 <p className="text-sm text-slate-600"><span className="font-semibold">Symptoms:</span> {h.symptoms}</p>
                 {h.status === 'treated' && (
                   <div className="mt-2 pt-2 border-t border-slate-200">
                     <p className="text-sm text-slate-800"><span className="font-semibold text-teal-700">Rx:</span> {h.prescription}</p>
                     <p className="text-sm text-slate-600 mt-1"><span className="font-semibold">Diagnosis:</span> {h.diagnosis}</p>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}