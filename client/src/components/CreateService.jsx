import React, { useState } from 'react';
import axios from 'axios';

const CreateService = ({ userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    price: '',
    deliveryTime: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://linkerr-api.onrender.com/api/services/create', {
        ...formData,
        provider: userId // We attach the current user as the seller
      });
      alert('✅ Service Published Successfully!');
      window.location.reload(); // Refresh page to see the new card
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      
      {/* 1. Header Section (Always Visible) */}
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Post a New Service</h2>
          <p className="text-slate-500 text-sm">Offer your skills to the network</p>
        </div>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 px-4 rounded-full transition-colors">
          {isExpanded ? "Cancel" : "+ Create"}
        </button>
      </div>

      {/* 2. Form Section (Hidden until clicked) */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Service Title</label>
            <input 
              type="text" name="title" required
              placeholder="e.g. I will build a React website"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea 
              name="description" required rows="3"
              placeholder="Describe what you will do..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Price ($)</label>
              <input 
                type="number" name="price" required
                placeholder="50"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Delivery Days</label>
              <input 
                type="number" name="deliveryTime" required
                placeholder="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select name="category" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" onChange={handleChange}>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
            🚀 Publish Service
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateService;