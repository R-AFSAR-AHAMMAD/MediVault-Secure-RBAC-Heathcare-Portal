import { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminPanel from './components/AdminPanel';
import DoctorPanel from './components/DoctorPanel';
import PatientPanel from './components/PatientPanel';
import api from './api';

function AppContent() {
  const { user, login, logout } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: 'Male' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const { data } = await api.post(endpoint, form);
      login(data);
    } catch(e) { 
      alert(e.response?.data?.message || 'Error occurred'); 
    }
  };

  if (!user) return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-teal-700">MediVault</h1>
        
        <div className="space-y-3">
          {isRegister && (
            <>
              <input name="name" className="border w-full p-2 rounded" placeholder="Full Name" onChange={handleChange} />
              <div className="flex gap-2">
                <input name="age" type="number" className="border w-1/2 p-2 rounded" placeholder="Age" onChange={handleChange} />
                <select name="gender" className="border w-1/2 p-2 rounded" onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </>
          )}
          
          <input name="email" className="border w-full p-2 rounded" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" className="border w-full p-2 rounded" placeholder="Password" onChange={handleChange} />
          
          <button onClick={handleSubmit} className="bg-teal-600 text-white w-full p-2 rounded font-bold hover:bg-teal-700 transition">
            {isRegister ? 'Register Patient' : 'Login'}
          </button>
        </div>

        <p className="text-sm text-center mt-4 cursor-pointer text-blue-600 hover:underline" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : 'New Patient? Create Account'}
        </p>
        
        {!isRegister && <p className="text-xs text-gray-400 mt-4 text-center">Admin: admin@medivault.com / admin</p>}
      </div>
    </div>
  );

  return (
    <div>
      <nav className="bg-teal-700 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">MediVault</span>
          <span className="text-xs bg-teal-800 px-2 py-1 rounded uppercase tracking-wider">{user.role}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-90">Hello, {user.name}</span>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition">Logout</button>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto mt-6">
        {user.role === 'admin' && <AdminPanel />}
        {user.role === 'doctor' && <DoctorPanel />}
        {user.role === 'patient' && <PatientPanel />}
      </main>
    </div>
  );
}

export default function App() { return <AuthProvider><AppContent /></AuthProvider>; }