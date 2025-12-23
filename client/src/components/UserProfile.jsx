import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Initial State for Form
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    bio: '',
    skills: '',
    profilePic: '',
    socials: { github: '', linkedin: '', website: '' },
    education: [],
    experience: []
  });

  // 1. Load User Data
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        try {
          // Fetch fresh data from server to get new fields (edu/exp)
          const res = await axios.get('https://linkerr-api.onrender.com/api/users');
          const freshUser = res.data.find(u => u._id === storedUser._id);
          
          if (freshUser) {
            setUser(freshUser);
            setFormData({
              name: freshUser.name || '',
              headline: freshUser.headline || '',
              location: freshUser.location || '',
              bio: freshUser.bio || '',
              skills: freshUser.skills ? freshUser.skills.join(', ') : '',
              profilePic: freshUser.profilePic || '',
              socials: freshUser.socials || { github: '', linkedin: '', website: '' },
              education: freshUser.education || [],
              experience: freshUser.experience || []
            });
          }
        } catch (err) {
          console.error("Error refreshing profile", err);
        }
      }
    };
    fetchUser();
  }, []);

  // --- HANDLERS FOR COMPLEX INPUTS ---

  // Handle Basic Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Socials
  const handleSocialChange = (e) => {
    setFormData({ 
      ...formData, 
      socials: { ...formData.socials, [e.target.name]: e.target.value } 
    });
  };

  // Handle Experience (Array)
  const handleExperienceChange = (index, e) => {
    const newExp = [...formData.experience];
    newExp[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experience: newExp });
  };
  const addExperience = () => {
    setFormData({ 
      ...formData, 
      experience: [...formData.experience, { company: '', role: '', year: '', description: '' }] 
    });
  };
  const removeExperience = (index) => {
    const newExp = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExp });
  };

  // Handle Education (Array)
  const handleEducationChange = (index, e) => {
    const newEdu = [...formData.education];
    newEdu[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: newEdu });
  };
  const addEducation = () => {
    setFormData({ 
      ...formData, 
      education: [...formData.education, { school: '', degree: '', year: '' }] 
    });
  };
  const removeEducation = (index) => {
    const newEdu = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEdu });
  };

  // Save Changes
  const handleSave = async () => {
    try {
      const res = await axios.put(`https://linkerr-api.onrender.com/api/users/profile/${user._id}`, formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setIsEditing(false);
      alert("✅ Profile Updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update");
    }
  };

  if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      
      {/* 🟢 VIEW MODE */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <div className="px-8 pb-8">
              <div className="flex justify-between items-start -mt-12 mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-4xl text-slate-400 font-bold">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-14 border border-slate-300 px-4 py-1.5 rounded-full text-slate-600 font-bold text-sm hover:bg-slate-50 transition">✎ Edit Profile</button>
              </div>

              <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-lg text-slate-600 mt-1">{user.headline || "No headline added"}</p>
              <p className="text-sm text-slate-500 mt-2">📍 {user.location || "Location not set"}</p>

              {/* Social Links */}
              <div className="flex gap-4 mt-4">
                {user.socials?.github && <a href={user.socials.github} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-black font-bold">GitHub</a>}
                {user.socials?.linkedin && <a href={user.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-blue-700 font-bold">LinkedIn</a>}
                {user.socials?.website && <a href={user.socials.website} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-blue-500 font-bold">Website</a>}
              </div>

              <hr className="my-6 border-slate-100" />

              <h3 className="text-lg font-bold text-slate-900 mb-2">About</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{user.bio || "No bio yet."}</p>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{skill}</span>)
                  ) : <span className="text-slate-400 italic text-sm">No skills added</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Experience</h2>
            {user.experience && user.experience.length > 0 ? (
              <div className="space-y-6">
                {user.experience.map((exp, i) => (
                  <div key={i} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                    <p className="text-slate-600">{exp.company} • <span className="text-slate-400 text-sm">{exp.year}</span></p>
                    <p className="text-slate-500 text-sm mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-400 italic">No experience added.</p>}
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Education</h2>
            {user.education && user.education.length > 0 ? (
              <div className="space-y-6">
                {user.education.map((edu, i) => (
                  <div key={i} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-bold text-lg text-slate-800">{edu.school}</h3>
                    <p className="text-slate-600">{edu.degree} • <span className="text-slate-400 text-sm">{edu.year}</span></p>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-400 italic">No education added.</p>}
          </div>
        </div>

      ) : (
        // 🔵 EDIT MODE
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
             <button onClick={() => setIsEditing(false)} className="text-red-500 font-bold text-sm">✕ Cancel</button>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Headline</label>
              <input type="text" name="headline" value={formData.headline} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Profile Pic URL</label>
              <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
          </div>

          {/* Socials */}
          <div className="bg-slate-50 p-4 rounded-lg">
             <h3 className="font-bold text-sm mb-3 uppercase text-slate-500">Social Links</h3>
             <div className="grid md:grid-cols-3 gap-4">
               <input type="text" name="github" placeholder="GitHub URL" value={formData.socials.github} onChange={handleSocialChange} className="border rounded p-2 text-sm" />
               <input type="text" name="linkedin" placeholder="LinkedIn URL" value={formData.socials.linkedin} onChange={handleSocialChange} className="border rounded p-2 text-sm" />
               <input type="text" name="website" placeholder="Portfolio URL" value={formData.socials.website} onChange={handleSocialChange} className="border rounded p-2 text-sm" />
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold mb-1">Bio</label>
             <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
             <label className="block text-sm font-bold mb-1">Skills (comma separated)</label>
             <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          {/* Experience Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-lg">Experience</h3>
               <button onClick={addExperience} className="text-blue-600 text-sm font-bold">+ Add Job</button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded mb-2 relative">
                <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-red-500 text-xs font-bold">✕ Remove</button>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input name="role" placeholder="Role (e.g. Intern)" value={exp.role} onChange={(e) => handleExperienceChange(index, e)} className="border rounded p-2 text-sm" />
                  <input name="company" placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className="border rounded p-2 text-sm" />
                </div>
                <div className="grid grid-cols-1 gap-2">
                   <input name="year" placeholder="Year (e.g. 2024 - Present)" value={exp.year} onChange={(e) => handleExperienceChange(index, e)} className="border rounded p-2 text-sm" />
                   <textarea name="description" placeholder="What did you do?" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className="border rounded p-2 text-sm" rows="2" />
                </div>
              </div>
            ))}
          </div>

          {/* Education Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-lg">Education</h3>
               <button onClick={addEducation} className="text-blue-600 text-sm font-bold">+ Add School</button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded mb-2 relative">
                <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-red-500 text-xs font-bold">✕ Remove</button>
                <div className="grid grid-cols-2 gap-2">
                  <input name="school" placeholder="School / University" value={edu.school} onChange={(e) => handleEducationChange(index, e)} className="border rounded p-2 text-sm" />
                  <input name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} className="border rounded p-2 text-sm" />
                  <input name="year" placeholder="Year (e.g. 2022 - 2026)" value={edu.year} onChange={(e) => handleEducationChange(index, e)} className="border rounded p-2 text-sm col-span-2" />
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg">Save Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;