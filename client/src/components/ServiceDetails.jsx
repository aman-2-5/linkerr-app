import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ServiceDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Service Info
        const serviceRes = await axios.get(`https://linkerr-api.onrender.com/api/services/${id}`);
        setService(serviceRes.data);

        // 2. Fetch Reviews for this Service
        const reviewsRes = await axios.get(`https://linkerr-api.onrender.com/api/reviews/${id}`);
        setReviews(reviewsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleOrder = async () => {
    if (!currentUser) return alert("Please login to buy");
    try {
      await axios.post('https://linkerr-api.onrender.com/api/orders', {
        serviceId: service._id,
        sellerId: service.provider._id,
        buyerId: currentUser._id,
        price: service.price
      });
      alert("✅ Order Placed Successfully!");
    } catch (err) {
      alert("Failed to place order");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Service...</div>;
  if (!service) return <div className="p-10 text-center">Service not found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: Service Info */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Thumbnail */}
        <div className="w-full h-80 bg-slate-100 rounded-xl overflow-hidden shadow-sm">
           <img src={service.thumbnail} alt={service.title} className="w-full h-full object-cover" />
        </div>

        {/* Title & Seller */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{service.title}</h1>
          <div className="flex items-center gap-3 mt-4">
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
               {service.provider?.name?.[0]}
             </div>
             <div>
               <p className="font-bold text-slate-900">{service.provider?.name}</p>
               <p className="text-sm text-slate-500">{service.provider?.headline || "Seller"}</p>
             </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3">About This Service</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{service.description}</p>
        </div>

        {/* ⭐ REVIEWS SECTION (The Fix) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            Reviews 
            <span className="text-slate-400 text-sm font-normal">({reviews.length})</span>
          </h3>

          {reviews.length === 0 ? (
            <p className="text-slate-500 italic">No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4">
                    
                    {/* Buyer Avatar */}
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {review.buyer?.profilePic ? (
                        <img src={review.buyer.profilePic} alt="Buyer" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-indigo-600">{review.buyer?.name?.[0] || "?"}</span>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900">
                          {review.buyer?.name || "Unknown User"} {/* 👈 HERE IS THE FIX */}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex text-yellow-400 text-sm my-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-slate-600 text-sm mt-1">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Pricing Card */}
      <div className="md:col-span-1">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg sticky top-24">
           <h3 className="text-slate-500 font-bold text-sm uppercase mb-2">Standard Package</h3>
           <div className="flex justify-between items-center mb-6">
             <span className="text-3xl font-bold text-slate-900">${service.price}</span>
             <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>
           </div>
           
           <p className="text-slate-600 text-sm mb-6">
             Includes full project delivery, source code, and unlimited revisions.
           </p>

           <button 
             onClick={handleOrder}
             className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-lg font-bold transition-all"
           >
             Continue (${service.price})
           </button>
           
           <button className="w-full mt-3 border border-slate-300 text-slate-600 py-3 rounded-lg font-bold hover:bg-slate-50 transition-all">
             Contact Seller
           </button>
        </div>
      </div>

    </div>
  );
};

export default ServiceDetails;