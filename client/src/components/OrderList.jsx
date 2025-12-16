import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetchOrders();
  }, [userId]);

  const fetchOrders = () => {
    axios.get(`https://linkerr-api.onrender.com/api/purchase/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`https://linkerr-api.onrender.com/api/purchase/${orderId}/status`, {
        status: newStatus
      });
      alert(`✅ Order marked as ${newStatus}!`);
      fetchOrders(); // Refresh list to see changes
    } catch (error) {
      alert("❌ Update failed");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center mt-6">
        <p className="text-slate-500">No orders found yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-bold text-slate-800">My Recent Orders</h2>
      </div>
      
      <div className="divide-y divide-slate-100">
        {orders.map((order) => {
          // Check if I am the seller
          const amISeller = order.sellerId?._id === userId;
          
          return (
            <div key={order._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition-colors">
              
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                    ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                  {amISeller && <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">YOU ARE SELLER</span>}
                </div>
                
                <h3 className="font-semibold text-slate-900">
                  {order.orderSnapshot.frozenTitle}
                </h3>
                <p className="text-sm text-slate-500">
                  {amISeller 
                    ? `Buyer: ${order.buyerId?.name || "Unknown"}` 
                    : `Seller: ${order.sellerId?.name || "Unknown"}`
                  }
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block font-bold text-emerald-600">${order.amount}</span>
                  <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                {/* LOGIC: Only show this button if I am the Seller AND it's not finished yet */}
                {amISeller && order.status === 'pending' && (
                  <button 
                    onClick={() => handleStatusUpdate(order._id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    ✓ Complete Job
                  </button>
                )}
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;