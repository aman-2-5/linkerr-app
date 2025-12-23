import React from 'react';
// 👇 This import assumes OrderList.jsx is in the SAME folder
import OrderList from './OrderList'; 

const OrdersPage = ({ user }) => {
  // Defensive check: If user is not logged in, show message instead of crashing
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-2">Access Denied</h2>
          <p className="text-slate-500">Please login to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
        <p className="text-slate-500 mt-1">Track your purchases and manage your freelance jobs.</p>
      </div>
      
      <OrderList userId={user._id} />
    </div>
  );
};

export default OrdersPage;