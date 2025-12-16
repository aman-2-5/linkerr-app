import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the users from your backend
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        // Since the API returns an array, we take the first user for now
        if (res.data.length > 0) {
          setUser(res.data[0]); 
        }
      })
      .catch(err => console.log(err));
  }, []);

  if (!user) return <div className="p-10">Loading Profile...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-10 p-6 border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.headline || "No headline yet"}</p>
          <p className="text-sm text-blue-600">{user.email}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-gray-700 font-semibold">About</h3>
        <p className="text-gray-600 mt-1">{user.bio || "No bio added."}</p>
      </div>

      <div className="mt-6 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
        <span className="text-gray-600">Wallet Balance</span>
        <span className="text-green-600 font-bold text-lg">${user.wallet_balance}</span>
      </div>
    </div>
  );
};

export default UserProfile;