import { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminPanel from './components/AdminPanel';
import DoctorPanel from './components/DoctorPanel';
import PatientPanel from './components/PatientPanel';
import api from './api';

function AppContent() {
  const { user, login, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/login', form);
      login(data);
    } catch(e) { alert('Invalid Login'); }
  };

  if (!user) return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">MediVault</h1>
        <input className="border w-full p-2 mb-3" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input className="border w-full p-2 mb-3" placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
        <button onClick={handleLogin} className="bg-indigo-600 text-white w-full p-2 rounded">Login</button>
        <p className="text-xs text-gray-500 mt-4 text-center">Demo: admin@medivault.com / admin</p>
      </div>
    </div>
  );

  return (
    <div>
      <nav className="bg-indigo-600 p-4 text-white flex justify-between">
        <span className="font-bold">MediVault ({user.role})</span>
        <button onClick={logout}>Logout</button>
      </nav>
      {user.role === 'admin' && <AdminPanel />}
      {user.role === 'doctor' && <DoctorPanel />}
      {user.role === 'patient' && <PatientPanel />}
    </div>
  );
}

export default function App() { return <AuthProvider><AppContent /></AuthProvider>; }