import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { User, MessageSquare, MapPin, Loader, Briefcase, ShoppingBag } from 'lucide-react';

const SearchResults = () => {
  const [results, setResults] = useState({ users: [], services: [] }); // Updated state to hold both
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch both users and services
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/search?q=${query}`);
        if (!response.ok) throw new Error('Failed to fetch results');
        
        const data = await response.json();
        // Backend returns { users: [...], services: [...] }
        setResults({ 
            users: data.users || [], 
            services: data.services || [] 
        });
      } catch (err) {
        console.error("Search Error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  // Navigation Functions
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); // Navigates to /profile/123
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`); // Navigates to /service/456
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {loading ? "Searching..." : `Results for "${query}"`}
      </h2>

      {loading && (
        <div className="flex justify-center p-10"><Loader className="animate-spin text-blue-600" /></div>
      )}

      {/* 1. PEOPLE RESULTS */}
      {results.users.length > 0 && (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">People</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.users.map((user) => (
                <div 
                    key={user._id} 
                    onClick={() => handleUserClick(user._id)} // CLICK HANDLER
                    className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    )}
                    
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-blue-600 font-medium mb-1">{user.headline || "Member"}</p>
                        <div className="text-xs text-gray-500 flex items-center">
                            <MapPin size={12} className="mr-1" /> {user.location || "N/A"}
                        </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
      )}

      {/* 2. SERVICE RESULTS */}
      {results.services.length > 0 && (
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.services.map((service) => (
                <div 
                    key={service._id} 
                    onClick={() => handleServiceClick(service._id)} // CLICK HANDLER
                    className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex justify-between items-center"
                >
                <div>
                    <h3 className="font-bold text-gray-900">{service.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-2 inline-block">
                        {service.category || "Service"}
                    </span>
                </div>
                <div className="text-green-600 font-bold text-lg">
                    ${service.price}
                </div>
                </div>
            ))}
            </div>
        </div>
      )}

      {!loading && results.users.length === 0 && results.services.length === 0 && (
        <div className="text-gray-500">No results found.</div>
      )}
    </div>
  );
};

export default SearchResults;