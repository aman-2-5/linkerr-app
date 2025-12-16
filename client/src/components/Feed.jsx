import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch posts when component loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://linkerr-api.onrender.com/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      await axios.post('https://linkerr-api.onrender.com/api/posts', {
        userId: user._id,
        content: content
      });
      setContent(''); // Clear box
      fetchPosts();   // Refresh feed instantly
    } catch (err) {
      alert("Error posting");
    }
  };

  return (
    <div className="mb-8">
      {/* --- CREATE POST BOX --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <textarea
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ring-blue-500 resize-none"
          rows="3"
          placeholder={`What's on your mind, ${user?.name}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button 
            onClick={handlePost}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* --- NEWS FEED --- */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center mb-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 mr-3">
                {post.user?.name?.[0] || "?"}
              </div>
              {/* Author Info */}
              <div>
                <h4 className="font-bold text-slate-900">{post.user?.name || "Unknown User"}</h4>
                <p className="text-xs text-slate-500">{post.user?.headline || "Professional"}</p>
              </div>
            </div>
            
            {/* Post Content */}
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        ))}
        
        {posts.length === 0 && (
          <p className="text-center text-slate-400 italic">No posts yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default Feed;