import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderList from './components/OrderList';
import CreateService from './components/CreateService';
import Login from './components/Login';
import Register from './components/Register'; // <--- NEW IMPORT
import './index.css';

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="relative h-48 w-full bg-slate-100">
        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" alt={service.title} className="w-full h-full object-cover"/>
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2 py-1 rounded-full border border-slate-200">{service.category}</span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-slate-900 font-semibold text-lg leading-tight mb-2 line-clamp-2">{service.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{service.description}</p>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <div className="flex flex-col"><span className="text-slate-400 text-xs uppercase tracking-wide">Starting at</span><span className="text-emerald-600 font-bold text-xl">${service.price}</span></div>
          <button onClick={() => onBook(service)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">Book Now</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false); // <--- NEW STATE
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://linkerr-api.onrender.com/api/services');
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleLogin = (data) => {
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleBook = async (service) => {
    try {
      const response = await axios.post('https://linkerr-api.onrender.com/api/purchase', {
        serviceId: service._id,
        buyerId: user._id
      });
      if (response.data.success) {
        alert(`✅ Order Placed! ID: ${response.data.orderId}`);
        window.location.reload();
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  // --- VIEW LOGIC ---
  if (!user) {
    if (isRegistering) {
      return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
    } else {
      return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-4">
      <div className="max-w-5xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        
        {/* PROFILE SIDEBAR */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-600 mt-1 text-sm">{user.email}</p>
            <button onClick={handleLogout} className="mt-4 text-sm text-red-500 hover:text-red-700 underline">Logout</button>
          </div>
        </div>

        {/* MAIN FEED */}
        <div className="md:col-span-2">
          <CreateService userId={user._id} /> 
          
          <h2 className="text-xl font-bold text-slate-900 mb-4">Active Services</h2>
          {loading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map(service => (
                <ServiceCard key={service._id} service={service} onBook={handleBook} />
              ))}
            </div>
          )}

          <div className="mt-10">
             <OrderList userId={user._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;