import { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminPanel from './components/AdminPanel';
import DoctorPanel from './components/DoctorPanel';
import PatientPanel from './components/PatientPanel';
import api from './api';

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
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-teal-700">MediVault</h1>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <>
              <input name="name" required className="border w-full p-2 rounded" placeholder="Full Name" onChange={handleChange} />
              <div className="flex gap-2">
                <input name="age" type="number" required className="border w-1/2 p-2 rounded" placeholder="Age" onChange={handleChange} />
                <select name="gender" className="border w-1/2 p-2 rounded" onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </>
          )}
          
          <input name="email" type="email" required className="border w-full p-2 rounded" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" required className="border w-full p-2 rounded" placeholder="Password" onChange={handleChange} />
          
          <button type="submit" className="bg-teal-600 text-white w-full p-2 rounded font-bold hover:bg-teal-700 transition">
            {isRegister ? 'Register Patient' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 cursor-pointer text-blue-600 hover:underline" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : 'New Patient? Create Account'}
        </p>
        
        {!isRegister && <p className="text-xs text-gray-400 mt-4 text-center">Admin: admin@medivault.com / admin</p>}
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
    <div>
      <nav className="bg-teal-700 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>MediVault</span>
          <span className="text-xs bg-teal-800 px-2 py-1 rounded uppercase tracking-wider">{user?.role}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-90">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition">Logout</button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto mt-6">
        {children}
      </main>
    </div>
  );
};

// --- 3. Protected Route Wrapper ---
// Ensures users can only access routes allowed for their role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
};

// --- 4. Main App Component with Routing ---
function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />

      {/* Protected Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorPanel />
        </ProtectedRoute>
      } />
      
      <Route path="/patient" element={
        <ProtectedRoute allowedRoles={['patient']}>
          <PatientPanel />
        </ProtectedRoute>
      } />

      {/* Default Redirect */}
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