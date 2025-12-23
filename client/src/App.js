import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Component Imports
import Feed from './components/Feed';
import ChatBox from './components/ChatBox'; 
import SearchResults from './components/SearchResults';
import CreateService from './components/CreateService';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Network from './components/Network';
import ServiceDetails from './components/ServiceDetails'; 
import OrdersPage from './components/OrdersPage'; // 👈 IMPORT THIS
import './index.css';

// --- SEARCH BAR ---
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery('');
    }
  };

  return (
    <div className="relative hidden md:block">
      <input
        type="text"
        placeholder="Search..."
        className="bg-slate-100 border border-slate-200 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 ring-blue-500 w-64 transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
      <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
    </div>
  );
};

// --- SERVICE CARD ---
const ServiceCard = ({ service }) => {
  const placeholderImg = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";

  return (
    <Link to={`/service/${service._id}`} className="block h-full"> 
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full cursor-pointer">
        <div className="relative h-48 w-full bg-slate-100">
          <img 
            src={service.thumbnail || placeholderImg} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2 py-1 rounded-full border border-slate-200">
            {service.category}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-slate-900 font-semibold text-lg leading-tight line-clamp-2 flex-grow">{service.title}</h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700 flex-shrink-0">
              <span>★</span>
              <span>{service.rating && service.rating > 0 ? service.rating.toFixed(1) : "New"}</span>
              <span className="text-slate-400 font-normal">({service.numReviews || 0})</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm line-clamp-2 mb-4">{service.description}</p>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase tracking-wide">Starting at</span>
              <span className="text-emerald-600 font-bold text-xl">${service.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
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
    window.location.href = '/'; 
  };

  if (!user) {
    if (isRegistering) {
      return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
    } else {
      return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />;
    }
  }

  // --- DASHBOARD ---
  const Dashboard = () => (
    <div className="max-w-5xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
      
      {/* PROFILE SIDEBAR */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-slate-100">
             {user.profilePic ? (
               <img src={user.profilePic} alt="Me" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                 {user.name.charAt(0)}
               </div>
             )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-slate-600 mt-1 text-sm">{user.headline || user.email}</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
             <Link to="/profile" className="text-blue-600 text-sm font-semibold hover:underline">Edit Profile Info</Link>
          </div>
        </div>
      </div>

      {/* FEED & SERVICES */}
      <div className="md:col-span-2">
        <Feed /> 
        <CreateService userId={user._id} /> 
        
        <h2 className="text-xl font-bold text-slate-900 mb-4">Active Services</h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        
        {/* NAVBAR */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
             <div className="flex items-center gap-8">
               <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">Linkerr</Link>
               <SearchBar />
             </div>
             
             <div className="flex items-center gap-6">
                <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium">Home</Link>
                <Link to="/network" className="text-slate-600 hover:text-blue-600 font-medium">Network</Link>
                {/* 👇 NEW ORDERS LINK */}
                <Link to="/orders" className="text-slate-600 hover:text-blue-600 font-medium">Orders</Link>
                
                <Link to="/profile" className="text-slate-600 hover:text-blue-600 font-medium">My Profile</Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium text-sm">Logout</button>
             </div>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
           <Route path="/" element={<Dashboard />} />
           <Route path="/profile" element={<UserProfile />} />
           <Route path="/network" element={<Network />} />
           <Route path="/search" element={<SearchResults />} />
           <Route path="/service/:id" element={<ServiceDetails />} />
           {/* 👇 NEW ROUTE */}
           <Route path="/orders" element={<OrdersPage user={user} />} />
        </Routes>

        {/* CHAT BOX */}
        {user && <ChatBox currentUser={user} />}

      </div>
    </Router>
  );
}

export default App;