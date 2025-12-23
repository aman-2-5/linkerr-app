import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = ({ userId }) => {
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState('buying');
  
  // Delivery State
  const [deliveryLink, setDeliveryLink] = useState('');
  const [deliveringOrderId, setDeliveringOrderId] = useState(null);

  // Review State
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`https://linkerr-api.onrender.com/api/orders/my-orders/${userId}`);
      setPurchases(res.data.purchases || []);
      setSales(res.data.sales || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleDeliver = async (orderId) => {
    if (!deliveryLink.trim()) return alert("Please paste a link");
    try {
      await axios.put(`https://linkerr-api.onrender.com/api/orders/deliver/${orderId}`, { deliveryLink });
      alert("✅ Work Delivered!");
      setDeliveryLink('');
      setDeliveringOrderId(null);
      fetchOrders(); 
    } catch (err) {
      alert("❌ Delivery failed");
    }
  };

  const handleSubmitReview = async (order) => {
    try {
      await axios.post('https://linkerr-api.onrender.com/api/reviews', {
        serviceId: order.service._id,
        buyerId: userId,
        rating,
        comment
      });
      alert("⭐ Review Submitted!");
      setReviewOrderId(null);
      setComment('');
      setRating(5);
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  const renderStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles[status] || "bg-gray-100"}`}>{status}</span>;
  };

  // 👇 FIX: Determine logic here instead of inside a sub-component
  const currentOrders = activeTab === 'buying' ? purchases : sales;
  const isSellerView = activeTab === 'selling';

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('buying')} 
          className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'buying' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Buying ({purchases.length})
        </button>
        <button 
          onClick={() => setActiveTab('selling')} 
          className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'selling' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Selling ({sales.length})
        </button>
      </div>

      {/* Main List */}
      {currentOrders.length === 0 ? (
        <div className="p-8 text-center text-slate-500">No orders found in this section.</div>
      ) : (
        <div className="space-y-4">
          {currentOrders.map((order) => (
            <div key={order._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
              
              {/* Top Row: Image & Info */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={order.service?.thumbnail} alt="Service" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{order.service?.title}</h3>
                    <div className="text-sm text-slate-500 mt-1 space-y-1">
                      <p>Price: <span className="font-semibold text-emerald-600">${order.price}</span></p>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>
                        {isSellerView 
                          ? `Buyer: ${order.buyer?.name} (${order.buyer?.email})` 
                          : `Seller: ${order.seller?.name} (${order.seller?.email})`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                {renderStatusBadge(order.status)}
              </div>

              {/* Bottom Row: Actions */}
              <div className="border-t border-slate-100 pt-4 mt-2">
                
                {/* 🟢 IF I AM THE BUYER */}
                {!isSellerView && (
                  <div>
                    {order.status === 'delivered' ? (
                      <div className="space-y-3">
                        {/* Download Box */}
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center">
                          <span className="text-sm text-green-800 font-medium">✅ Order Ready!</span>
                          <a href={order.deliveryWork} target="_blank" rel="noreferrer" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700">Download Files ⬇</a>
                        </div>
                        
                        {/* Review Box */}
                        {reviewOrderId === order._id ? (
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animation-fade-in">
                            <h4 className="font-bold text-sm mb-2 text-slate-800">Write a Review</h4>
                            
                            {/* Star Rating */}
                            <div className="flex gap-1 mb-3">
                              {[1,2,3,4,5].map(star => (
                                <button 
                                  key={star} 
                                  onClick={() => setRating(star)} 
                                  className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>

                            <textarea 
                              className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 ring-blue-500" 
                              placeholder="How was the service? (e.g. Fast delivery, great code!)"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows="3"
                              autoFocus
                            />
                            
                            <div className="flex gap-3">
                              <button onClick={() => handleSubmitReview(order)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Submit Review</button>
                              <button onClick={() => setReviewOrderId(null)} className="text-slate-500 text-sm font-medium hover:text-slate-700">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setReviewOrderId(order._id)} 
                            className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1"
                          >
                            ⭐ Write a Review
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">Waiting for seller to deliver...</p>
                    )}
                  </div>
                )}

                {/* 🔵 IF I AM THE SELLER */}
                {isSellerView && (
                  <div>
                    {order.status === 'pending' ? (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-2">Deliver Work</h4>
                        {deliveringOrderId === order._id ? (
                          <div className="flex gap-2">
                            <input type="text" placeholder="Paste GitHub / Drive Link..." className="flex-grow border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-blue-500" value={deliveryLink} onChange={(e) => setDeliveryLink(e.target.value)} />
                            <button onClick={() => handleDeliver(order._id)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700">Send</button>
                            <button onClick={() => setDeliveringOrderId(null)} className="text-slate-500 text-sm">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeliveringOrderId(order._id)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700">Start Delivery</button>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">You delivered this. <a href={order.deliveryWork} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Link</a></div>
                    )}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;