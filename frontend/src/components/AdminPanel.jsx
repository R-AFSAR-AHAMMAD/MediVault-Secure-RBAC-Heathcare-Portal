import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminPanel() {
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' });

  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data)) }, []);

  const hire = () => api.post('/admin/hire', form).then(() => alert('Hired!'));

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">Doctors: {stats.doctors}</div>
        <div className="bg-green-100 p-4 rounded">Patients: {stats.patients}</div>
        <div className="bg-red-100 p-4 rounded">Active Cases: {stats.active}</div>
      </div>
      <div className="border p-4 rounded">
        <h3 className="font-bold mb-2">Hire Doctor</h3>
        <input className="border p-2 m-1" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
        <input className="border p-2 m-1" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input className="border p-2 m-1" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <input className="border p-2 m-1" placeholder="Spec" onChange={e => setForm({...form, specialization: e.target.value})} />
        <button onClick={hire} className="bg-blue-500 text-white p-2 rounded">Hire</button>
      </div>
    </div>
  );
}
