import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(''); // Store uploaded image URL
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://linkerr-api.onrender.com/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await axios.post('https://linkerr-api.onrender.com/api/upload', data);
      setImage(res.data.url);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert("Image upload failed");
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    try {
      await axios.post('https://linkerr-api.onrender.com/api/posts', {
        userId: user._id,
        content,
        image // Send image URL to backend
      });
      setContent('');
      setImage(''); // Reset image
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`https://linkerr-api.onrender.com/api/posts/like/${postId}`, { userId: user._id });
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* 📝 CREATE POST BOX */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
             {user?.profilePic && <img src={user.profilePic} alt="Me" className="w-full h-full object-cover" />}
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full p-2 text-sm outline-none resize-none"
              placeholder="Start a post..."
              rows="2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {/* Image Preview Area */}
            {image && (
              <div className="relative mt-2 mb-2 w-full h-48 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImage('')}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs hover:bg-black/70"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
              {/* 📷 Photo Upload Button */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-blue-600 transition text-sm font-medium">
                <span>📷 Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>

              <button 
                onClick={handlePost}
                disabled={uploading || (!content && !image)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-bold transition disabled:bg-slate-300"
              >
                {uploading ? 'Uploading...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📰 FEED */}
      {posts.map(post => (
        <div key={post._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          
          {/* Header */}
          <div className="flex gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              {post.user?.profilePic ? (
                <img src={post.user.profilePic} alt={post.user.name} className="w-full h-full object-cover" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                    {post.user?.name?.[0]}
                 </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{post.user?.name}</h3>
              <p className="text-xs text-slate-500">{post.user?.headline || "Student"}</p>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-800 mb-3 whitespace-pre-wrap">{post.content}</p>

          {/* 👇 Post Image (If it exists) */}
          {post.image && (
            <div className="mb-3 rounded-lg overflow-hidden border border-slate-100">
              <img src={post.image} alt="Post content" className="w-full object-cover max-h-96" />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
            <button 
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-2 text-sm font-medium transition ${post.likes.includes(user._id) ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              👍 Like ({post.likes.length})
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition">
              💬 Comment ({post.comments.length})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;