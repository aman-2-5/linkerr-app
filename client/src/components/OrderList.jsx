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
  const [reviewOrderId, setReviewOrderId] = useState(null); // Which order is being reviewed?
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
    return <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles[status]}`}>{status}</span>;
  };

  const OrdersView = ({ orders, isSellerView }) => {
    if (!orders || orders.length === 0) return <div className="p-8 text-center text-slate-500">No orders found.</div>;

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            {/* Order Info */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                  <img src={order.service?.thumbnail} alt="Service" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{order.service?.title}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    <p className="font-semibold text-emerald-600">${order.price}</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              {renderStatusBadge(order.status)}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2">
              {/* 🟢 BUYER ACTIONS */}
              {!isSellerView && (
                <div>
                  {order.status === 'delivered' ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex justify-between items-center">
                        <span className="text-sm text-green-800 font-medium">✅ Order Ready!</span>
                        <a href={order.deliveryWork} target="_blank" rel="noreferrer" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700">Download Files ⬇</a>
                      </div>
                      
                      {/* Review Section */}
                      {reviewOrderId === order._id ? (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h4 className="font-bold text-sm mb-2">Write a Review</h4>
                          <div className="flex gap-2 mb-2">
                            {[1,2,3,4,5].map(star => (
                              <button key={star} onClick={() => setRating(star)} className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                            ))}
                          </div>
                          <textarea 
                            className="w-full border rounded p-2 text-sm mb-2" 
                            placeholder="How was the service?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSubmitReview(order)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">Submit</button>
                            <button onClick={() => setReviewOrderId(null)} className="text-slate-500 text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setReviewOrderId(order._id)} className="text-blue-600 text-sm font-bold hover:underline">⭐ Write a Review</button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Waiting for delivery...</p>
                  )}
                </div>
              )}

              {/* 🔵 SELLER ACTIONS */}
              {isSellerView && (
                <div>
                  {order.status === 'pending' ? (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-bold text-blue-900 mb-2">Deliver Work</h4>
                      {deliveringOrderId === order._id ? (
                        <div className="flex gap-2">
                          <input type="text" placeholder="Link..." className="flex-grow border rounded px-3 py-2 text-sm" value={deliveryLink} onChange={(e) => setDeliveryLink(e.target.value)} />
                          <button onClick={() => handleDeliver(order._id)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm">Send</button>
                          <button onClick={() => setDeliveringOrderId(null)} className="text-slate-500 text-sm">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeliveringOrderId(order._id)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm">Start Delivery</button>
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
    );
  };

  return (
    <div className="mt-8">
      <div className="flex gap-6 border-b border-slate-200 mb-6">
        <button onClick={() => setActiveTab('buying')} className={`pb-3 text-sm font-bold ${activeTab === 'buying' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Buying ({purchases.length})</button>
        <button onClick={() => setActiveTab('selling')} className={`pb-3 text-sm font-bold ${activeTab === 'selling' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Selling ({sales.length})</button>
      </div>
      {activeTab === 'buying' ? <OrdersView orders={purchases} isSellerView={false} /> : <OrdersView orders={sales} isSellerView={true} />}
    </div>
  );
};

export default OrderList;