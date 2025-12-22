import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Service Data State
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review Data State
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Service Info
        const serviceRes = await axios.get(`https://linkerr-api.onrender.com/api/services/${id}`);
        setService(serviceRes.data);
        
        // 2. Fetch Reviews
        const reviewsRes = await axios.get(`https://linkerr-api.onrender.com/api/reviews/${id}`);
        setReviews(reviewsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBook = async () => {
    if(!currentUser) return alert("Please login to book");
    try {
      // 👇 THIS IS THE FIX: Use the correct new route
      const response = await axios.post('https://linkerr-api.onrender.com/api/orders/purchase', {
        serviceId: service._id,
        buyerId: currentUser._id
      });
      if (response.data.success) {
        alert(`✅ Order Placed! ID: ${response.data.orderId}`);
        navigate('/'); // Redirect to home
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please login to review");

    try {
      const res = await axios.post('https://linkerr-api.onrender.com/api/reviews', {
        serviceId: service._id,
        userId: currentUser._id,
        rating: newReview.rating,
        comment: newReview.comment
      });

      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      alert("Review Posted!");
    } catch (err) {
      alert("Error posting review");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!service) return <div className="p-10 text-center">Service not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      
      {/* 🔙 Back Button */}
      <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-600 mb-4 flex items-center gap-2">
        ← Back to Browse
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Service Info + REVIEWS */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Main Service Card */}
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img 
                src={service.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"} 
                alt={service.title} 
                className="w-full object-cover max-h-[400px]"
              />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{service.title}</h1>
            
            {/* Seller Info */}
            <div className="flex items-center gap-3 py-4 border-y border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                {service.seller?.profilePic ? (
                  <img src={service.seller.profilePic} alt="Seller" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                    {service.seller?.name?.[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{service.seller?.name}</p>
                <p className="text-xs text-slate-500">{service.seller?.headline || "Freelancer"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">About This Gig</h3>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{service.description}</p>
            </div>
          </div>

          {/* ⭐ REVIEWS SECTION ⭐ */}
          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Reviews ({reviews.length})</h3>

            {/* Review Form */}
            {currentUser && (
              <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-200">
                <h4 className="font-bold text-sm mb-3">Write a Review</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-slate-600">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm mb-3 focus:ring-2 ring-blue-500 outline-none"
                  rows="2"
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                ></textarea>
                <button 
                  onClick={handleSubmitReview}
                  disabled={!newReview.comment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition disabled:bg-slate-300"
                >
                  Post Review
                </button>
              </div>
            )}

            {/* Review List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-slate-500 italic">No reviews yet. Be the first!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                         {review.user?.profilePic ? (
                           <img src={review.user.profilePic} alt="User" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                             {review.user?.name?.[0]}
                           </div>
                         )}
                      </div>
                      <span className="font-bold text-sm text-slate-900">{review.user?.name}</span>
                      <span className="text-yellow-400 text-sm">
                        {'★'.repeat(review.rating)}
                        <span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span>
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm ml-10">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Pricing Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 sticky top-24">
            <div className="flex justify-between items-end mb-4">
              <span className="text-slate-500 font-bold text-sm">STANDARD</span>
              <span className="text-3xl font-bold text-slate-900">${service.price}</span>
            </div>
            
            <p className="text-slate-500 text-sm mb-6">
              You will get a complete {service.category} service with all standard files included.
            </p>

            <button 
              onClick={handleBook}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              Continue (${service.price})
            </button>
            
            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400">Secure Transaction</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;