import { useState, useEffect } from 'react';
import api from '../api';

export default function DoctorPanel() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  // State is now an object mapped by ID: { "apptId1": { diagnosis: "...", prescription: "..." } }
  const [forms, setForms] = useState({});

  useEffect(() => { 
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    api.get('/appointments')
      .then(r => {
        setAppts(r.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load appointments", err);
        setLoading(false);
      });
  };

  const handleInputChange = (id, field, value) => {
    setForms(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const treat = async (id) => {
    const treatmentData = forms[id];
    if (!treatmentData?.diagnosis || !treatmentData?.prescription) {
      alert("Please fill in both Diagnosis and Prescription");
      return;
    }

    try {
      await api.put(`/treat/${id}`, treatmentData);
      alert('Treatment Submitted successfully');
      // Update local UI without reloading page
      setAppts(prev => prev.map(a => 
        a._id === id ? { ...a, status: 'treated', ...treatmentData } : a
      ));
    } catch (error) {
      alert("Failed to submit treatment");
    }
  };

  if (loading) return <div className="p-5 text-center">Loading patient records...</div>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Patient Consultations</h2>
      
      {appts.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500 text-lg">No appointments found.</p>
          <p className="text-sm text-gray-400">Patients must book a consultation first.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appts.map(a => (
            <div key={a._id} className={`p-5 rounded-lg shadow-sm border ${a.status === 'treated' ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4 border-l-orange-500'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg text-gray-800">{a.patientName}</p>
                  <p className="text-gray-600 text-sm">Symptoms: {a.symptoms}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${a.status === 'treated' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {a.status}
                </span>
              </div>

              {a.status === 'pending' ? (
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input 
                      className="border p-2 rounded" 
                      placeholder="Diagnosis" 
                      value={forms[a._id]?.diagnosis || ''}
                      onChange={e => handleInputChange(a._id, 'diagnosis', e.target.value)} 
                    />
                    <input 
                      className="border p-2 rounded" 
                      placeholder="Prescription" 
                      value={forms[a._id]?.prescription || ''}
                      onChange={e => handleInputChange(a._id, 'prescription', e.target.value)} 
                    />
                  </div>
                  <button onClick={() => treat(a._id)} className="bg-teal-600 text-white px-4 py-2 rounded w-full hover:bg-teal-700 transition">Submit Treatment</button>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500 border-t pt-2">
                  <p><strong>Diagnosis:</strong> {a.diagnosis}</p>
                  <p><strong>Rx:</strong> {a.prescription}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}