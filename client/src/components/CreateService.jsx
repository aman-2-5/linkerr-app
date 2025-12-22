import React, { useState } from 'react';
import axios from 'axios';

const CreateService = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    price: '',
    thumbnail: '' // Store the uploaded image URL here
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await axios.post('https://linkerr-api.onrender.com/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Save the Cloudinary URL to our form state
      setFormData({ ...formData, thumbnail: res.data.url });
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://linkerr-api.onrender.com/api/services', {
        ...formData,
        sellerId: userId
      });
      alert('Service Created Successfully!');
      window.location.reload(); // Refresh to see the new gig
    } catch (err) {
      alert('Error creating service');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Post a New Gig</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Service Title</label>
          <input 
            type="text" 
            name="title" 
            placeholder="I will build a React website..." 
            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 ring-blue-500 outline-none"
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
           <label className="block text-sm font-semibold text-slate-600 mb-1">Gig Thumbnail (Image)</label>
           <input 
             type="file" 
             accept="image/*"
             onChange={handleImageUpload}
             className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
           />
           {uploading && <p className="text-xs text-blue-500 mt-1">Uploading image...</p>}
           {formData.thumbnail && <p className="text-xs text-green-600 mt-1">✅ Image attached!</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
          <textarea 
            name="description" 
            placeholder="Describe what you will do..." 
            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 ring-blue-500 outline-none"
            rows="3" 
            onChange={handleChange} 
            required 
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Category</label>
            <select name="category" onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm">
              <option>Development</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Writing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Price ($)</label>
            <input 
              type="number" 
              name="price" 
              placeholder="50" 
              className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 ring-blue-500 outline-none"
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Create Service'}
        </button>
      </form>
    </div>
  );
};

export default CreateService;