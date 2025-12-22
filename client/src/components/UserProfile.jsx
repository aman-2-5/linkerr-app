import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [headline, setHeadline] = useState(user?.headline || '');
  const [uploading, setUploading] = useState(false);

  // 1. Handle File Selection & Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // A. Upload to Cloudinary via your Backend
      const uploadRes = await axios.post('https://linkerr-api.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = uploadRes.data.url;

      // B. Save URL to MongoDB
      const updateRes = await axios.put('https://linkerr-api.onrender.com/api/users/profile', {
        userId: user._id,
        profilePic: imageUrl
      });

      // C. Update Local State & LocalStorage
      const updatedUser = updateRes.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUploading(false);
      alert("Profile Picture Updated!");

    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Error uploading image. Check console.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put('https://linkerr-api.onrender.com/api/users/profile', {
        userId: user._id,
        headline: headline
      });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      alert("Profile Info Updated");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center border-b border-slate-100 pb-8 mb-8">
          
          {/* AVATAR UPLOAD TRIGGER */}
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm relative">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                  {user.name.charAt(0)}
                </div>
              )}
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition">
                <span className="text-white text-xs font-bold">Change Photo</span>
              </div>
            </div>

            {/* Hidden Input */}
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </div>
          
          {uploading && <p className="text-xs text-blue-600 mt-2 animate-pulse">Uploading...</p>}

          <h1 className="text-3xl font-bold text-slate-900 mt-4">{user.name}</h1>
          <p className="text-slate-500">{user.email}</p>
        </div>

        {/* EDIT DETAILS SECTION */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Professional Headline</label>
            <input 
              type="text" 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 ring-blue-500 outline-none"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Ex: Full Stack Developer | Student at VIT"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSaveProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;