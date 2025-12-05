import { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminPanel from './components/AdminPanel';
import DoctorPanel from './components/DoctorPanel';
import PatientPanel from './components/PatientPanel';
import api from './api';
import { LayoutDashboard, LogOut, User, Stethoscope, Activity } from 'lucide-react'; // Assuming you have lucide-react, if not remove icons

// --- 1. Login/Register Page Component ---
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: 'Male' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const { data } = await api.post(endpoint, form);
      login(data);
      
      // Redirect based on role
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'doctor') navigate('/doctor');
      else if (data.role === 'patient') navigate('/patient');
    } catch(e) { 
      alert(e.response?.data?.message || 'Error occurred'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700 flex items-center justify-center gap-2">
            <Activity className="w-8 h-8" /> MediVault
          </h1>
          <p className="text-slate-500 text-sm mt-2">Secure Healthcare Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">Full Name</label>
                <input name="name" required className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition" placeholder="John Doe" onChange={handleChange} />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2 space-y-1">
                   <label className="text-xs font-semibold text-slate-600 uppercase">Age</label>
                   <input name="age" type="number" required className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="25" onChange={handleChange} />
                </div>
                <div className="w-1/2 space-y-1">
                   <label className="text-xs font-semibold text-slate-600 uppercase">Gender</label>
                   <select name="gender" className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-white" onChange={handleChange}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
            </>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase">Email Address</label>
            <input name="email" type="email" required className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="name@example.com" onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase">Password</label>
            <input name="password" type="password" required className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="••••••••" onChange={handleChange} />
          </div>
          
          <button type="submit" className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 mt-4">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600 hover:text-teal-600 cursor-pointer font-medium transition" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Already have an account? Login' : 'New Patient? Create Account'}
          </p>
          {!isRegister && <p className="text-xs text-slate-400 mt-4 bg-slate-50 p-2 rounded">Demo Admin: admin@medivault.com / admin</p>}
        </div>
      </div>
    </div>
  );
};

// --- 2. Layout Component (Navbar) ---
const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-teal-600 text-white p-1.5 rounded-lg">
                <Activity size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">MediVault</span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider ml-2">{user?.role}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                   <User size={16} />
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// --- 3. Protected Route Wrapper ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
};

// --- 4. Main App Component ---
function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
      <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPanel /></ProtectedRoute>} />
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientPanel /></ProtectedRoute>} />
      <Route path="/" element={
        user ? (
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'doctor' ? <Navigate to="/doctor" /> :
          <Navigate to="/patient" />
        ) : <Navigate to="/login" />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}