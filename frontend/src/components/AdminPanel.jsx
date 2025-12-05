import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminPanel() {
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '' });

  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data)) }, []);

  const hire = async () => {
    try {
        await api.post('/admin/hire', form);
        alert('Doctor hired successfully!');
        // Ideally clear form here
    } catch (e) {
        alert('Error hiring doctor');
    }
  } 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Doctors</span>
          <span className="text-4xl font-bold text-blue-600 mt-2">{stats.doctors || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Patients</span>
          <span className="text-4xl font-bold text-teal-600 mt-2">{stats.patients || 0}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active Cases</span>
          <span className="text-4xl font-bold text-rose-600 mt-2">{stats.active || 0}</span>
        </div>
      </div>

      {/* Hire Doctor Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Onboard Medical Staff</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doctor Name" onChange={e => setForm({...form, name: e.target.value})} />
            <input className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email Address" onChange={e => setForm({...form, email: e.target.value})} />
            <input className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" type="password" placeholder="Temporary Password" onChange={e => setForm({...form, password: e.target.value})} />
            <input className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Specialization (e.g. Cardiology)" onChange={e => setForm({...form, specialization: e.target.value})} />
          </div>
          <button onClick={hire} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md">
            Hire Doctor
          </button>
        </div>
      </div>
    </div>
  );
}