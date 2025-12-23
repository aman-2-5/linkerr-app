import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    bio: '',
    skills: '',
    profilePic: ''
  });

  // 1. Load User Data on Mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || '',
        headline: storedUser.headline || '',
        location: storedUser.location || '',
        bio: storedUser.bio || '',
        skills: storedUser.skills ? storedUser.skills.join(', ') : '',
        profilePic: storedUser.profilePic || ''
      });
    }
  }, []);

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Save Changes
  const handleSave = async () => {
    try {
      const res = await axios.put(`https://linkerr-api.onrender.com/api/users/profile/${user._id}`, formData);
      
      // Update Local Storage & State
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setIsEditing(false);
      alert("✅ Profile Updated Successfully!");
      
      // Optional: Reload page to reflect changes everywhere
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    }
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      
      {/* 🟢 VIEW MODE (Standard Profile) */}
      {!isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

          <div className="px-8 pb-8">
            <div className="flex justify-between items-start -mt-12 mb-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl text-slate-400 font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* Edit Button */}
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-14 border border-slate-300 px-4 py-1.5 rounded-full text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
              >
                ✎ Edit Profile
              </button>
            </div>

            {/* Info */}
            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-lg text-slate-600 mt-1">{user.headline || "No headline added yet"}</p>
            <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
              📍 {user.location || "Location not set"}
            </p>

            <hr className="my-6 border-slate-100" />

            {/* About */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">About</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {user.bio || "Write a short bio to introduce yourself..."}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-sm">No skills added yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        
        // 🔵 EDIT MODE (Form)
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h2>
          
          <div className="space-y-5">
            {/* Profile Pic URL */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Profile Picture URL</label>
              <input 
                type="text" 
                name="profilePic" 
                value={formData.profilePic} 
                onChange={handleChange}
                placeholder="https://imgur.com/..." 
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Paste a link to your photo (LinkedIn, Imgur, etc.)</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
              />
            </div>

            {/* Headline */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Headline</label>
              <input 
                type="text" 
                name="headline" 
                value={formData.headline} 
                onChange={handleChange}
                placeholder="Ex: Full Stack Developer | Student at VIT-AP"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                placeholder="Ex: Andhra Pradesh, India"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">About</label>
              <textarea 
                name="bio" 
                rows="4"
                value={formData.bio} 
                onChange={handleChange}
                placeholder="Tell us about your experience..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Skills (Comma separated)</label>
              <input 
                type="text" 
                name="skills" 
                value={formData.skills} 
                onChange={handleChange}
                placeholder="Java, React, Cybersecurity, Python"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 ring-blue-500 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;