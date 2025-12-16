import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Network = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(storedUser);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      // Filter out the current logged-in user from the list
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const others = res.data.filter(u => u._id !== storedUser?._id);
      setUsers(others);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (targetId) => {
    try {
      await axios.put(`https://linkerr-api.onrender.com/api/users/connect/${targetId}`, {
        currentUserId: currentUser._id
      });
      alert("✅ Connected!");
      // Optional: Refresh list or disable button
    } catch (err) {
      alert("Error connecting (maybe already connected?)");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Find Professionals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition">
            
            {/* Avatar Circle */}
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            
            {/* User Info */}
            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500 mb-2">{user.headline || "No headline"}</p>
            
            {/* Skills Tags */}
            <div className="flex flex-wrap gap-1 justify-center mb-4 min-h-[40px]">
              {user.skills?.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                  {skill}
                </span>
              ))}
            </div>

            {/* Connect Button */}
            <button 
              onClick={() => handleConnect(user._id)}
              className="mt-auto w-full py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Network;