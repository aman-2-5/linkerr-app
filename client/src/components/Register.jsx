import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://linkerr-api.onrender.com/api/auth/register', formData);
      alert('✅ Registration Successful! Please Login.');
      onSwitchToLogin(); // Switch back to login screen automatically
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">Create Account</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-2 mb-4 rounded text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input 
              type="text" name="name" required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input 
              type="email" name="email" required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" name="password" required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Register
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <br/>
          <button onClick={onSwitchToLogin} className="text-blue-600 font-bold hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;