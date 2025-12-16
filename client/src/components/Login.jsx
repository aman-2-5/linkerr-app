import React, { useState } from 'react';
import axios from 'axios';

// <--- Added 'onSwitchToRegister' prop
const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Welcome Back</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-2 mb-4 rounded text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input 
              type="email" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
        
        {/* <--- New Switch Button */}
        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account? <br/>
          <button onClick={onSwitchToRegister} className="text-blue-600 font-bold hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;