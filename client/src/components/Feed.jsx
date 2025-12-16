import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns'; // <--- NEW IMPORT

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  // Track which post has the comment box open
  const [activeCommentBox, setActiveCommentBox] = useState(null); 
  const [commentText, setCommentText] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

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
      setContent('');
      fetchPosts();
    } catch (err) {
      alert("Error posting");
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedPosts = posts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(user._id);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== user._id) 
              : [...post.likes, user._id] 
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      await axios.put(`https://linkerr-api.onrender.com/api/posts/like/${postId}`, { userId: user._id });
    } catch (err) {
      fetchPosts(); // Revert on error
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`https://linkerr-api.onrender.com/api/posts/comment/${postId}`, {
        userId: user._id,
        text: commentText
      });
      setCommentText('');
      setActiveCommentBox(null); // Close box
      fetchPosts(); // Refresh to show new comment with name
    } catch (err) {
      alert("Error commenting");
    }
  };

  return (
    <div className="mb-8">
      {/* POST BOX */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <textarea
          className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ring-blue-500 resize-none"
          rows="3"
          placeholder={`What's on your mind, ${user?.name}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button onClick={handlePost} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Post</button>
        </div>
      </div>

      {/* FEED */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isLiked = post.likes?.includes(user._id);
          return (
            <div key={post._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              
              {/* 👇 UPDATED HEADER WITH TIMESTAMP 👇 */}
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 mr-3">
                  {post.user?.name?.[0] || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{post.user?.name || "Unknown User"}</h4>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">
                      {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{post.user?.headline || "Professional"}</p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 border-t border-slate-100 pt-3">
                <button onClick={() => handleLike(post._id)} className={`flex items-center gap-2 text-sm font-medium transition ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
                  <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span> {post.likes?.length || 0} Likes
                </button>
                
                <button onClick={() => setActiveCommentBox(activeCommentBox === post._id ? null : post._id)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition">
                  💬 Comment
                </button>
              </div>

              {/* Comment Section */}
              <div className="mt-4 space-y-3">
                {/* Input Box */}
                {activeCommentBox === post._id && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-grow border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-blue-500"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                    />
                    <button onClick={() => handleCommentSubmit(post._id)} className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold">Send</button>
                  </div>
                )}

                {/* List of Comments */}
                {post.comments?.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-bold text-slate-800">{comment.user?.name || "User"}: </span>
                        <span className="text-slate-600">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {posts.length === 0 && (
          <p className="text-center text-slate-400 italic">No posts yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default Feed;