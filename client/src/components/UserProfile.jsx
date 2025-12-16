import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State for Editing
  const [formData, setFormData] = useState({
    headline: '',
    about: '',
    location: '',
    skills: '' 
  });

  // 1. Get the real logged-in User ID
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?._id;

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      // 2. Fetch SPECIFIC user data
      // (Make sure to use your Cloud URL if you deployed, or localhost if testing locally)
      const res = await axios.get(`https://linkerr-api.onrender.com/api/users/${userId}`);
      setUser(res.data);
      
      // Pre-fill the form
      setFormData({
        headline: res.data.headline || '',
        about: res.data.about || '',
        location: res.data.location || '',
        skills: res.data.skills ? res.data.skills.join(', ') : ''
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Convert comma-separated string (React, Node) back to Array
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      
      const res = await axios.put(`https://linkerr-api.onrender.com/api/users/${userId}`, {
        ...formData,
        skills: skillsArray
      });
      
      setUser(res.data);
      setIsEditing(false);
      alert("✅ Profile Updated!");
    } catch (err) {
      alert("❌ Error updating profile");
      console.error(err);
    }
  };

  if (!userId) return <div className="p-10 text-center text-red-500">Please Log In first.</div>;
  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border border-slate-200">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
          
          {isEditing ? (
            <div className="mt-3 space-y-2">
              <input 
                name="headline" 
                value={formData.headline} 
                onChange={handleChange} 
                className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" 
                placeholder="Headline (e.g. MERN Developer)"
              />
              <input 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                className="w-full border p-2 rounded focus:ring-2 ring-blue-500 outline-none" 
                placeholder="City, Country"
              />
            </div>
          ) : (
            <>
              <p className="text-xl text-slate-600 mt-1">{user.headline || "Add a professional headline"}</p>
              <p className="text-sm text-slate-500 mt-1">📍 {user.location || "Location not set"}</p>
            </>
          )}
        </div>

        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`mt-4 md:mt-0 px-6 py-2 rounded-lg font-bold text-white transition shadow-sm
            ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* --- ABOUT SECTION --- */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">About</h2>
        {isEditing ? (
          <textarea 
            name="about" 
            value={formData.about} 
            onChange={handleChange} 
            className="w-full border p-3 rounded-lg h-32 focus:ring-2 ring-blue-500 outline-none"
            placeholder="Tell your professional story..."
          />
        ) : (
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {user.about || "Write a bio to introduce yourself to clients and connections."}
          </p>
        )}
      </div>

      {/* --- SKILLS SECTION --- */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-3">Skills</h2>
        {isEditing ? (
          <input 
            name="skills" 
            value={formData.skills} 
            onChange={handleChange} 
            className="w-full border p-3 rounded-lg focus:ring-2 ring-blue-500 outline-none"
            placeholder="Java, Python, Cybersecurity (comma separated)"
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-500 italic">No skills added yet.</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserProfile;