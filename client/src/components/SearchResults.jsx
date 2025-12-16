import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
  const [results, setResults] = useState({ users: [], services: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get the "q" parameter from URL (e.g., /search?q=python)
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) fetchResults();
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://linkerr-api.onrender.com/api/search?q=${query}`);
      setResults(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8 pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <p>Searching...</p>
      ) : (
        <div className="space-y-10">
          
          {/* --- PEOPLE RESULTS --- */}
          <section>
            <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">People</h2>
            {results.users.length === 0 ? (
              <p className="text-slate-400 italic">No professionals found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.users.map(user => (
                  <div key={user._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-500">{user.headline || "Professional"}</p>
                      {/* Link to connect/view profile could go here */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* --- SERVICE RESULTS --- */}
          <section>
            <h2 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">Services</h2>
            {results.services.length === 0 ? (
              <p className="text-slate-400 italic">No services found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.services.map(service => (
                  <div key={service._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{service.category}</span>
                      <span className="text-emerald-600 font-bold">${service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
};

export default SearchResults;