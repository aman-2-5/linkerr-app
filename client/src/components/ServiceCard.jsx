import React from 'react';

const ServiceCard = ({ service, onBook }) => {
  // Destructure with defaults to prevent crashes
  const { 
    title = "Service Title", 
    price = 0, 
    image = "https://via.placeholder.com/400x225", // 16:9 Placeholder
    category = "General", 
    rating = 0, 
    reviewCount = 0 
  } = service;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* 16:9 Image Area */}
      <div className="relative h-48 w-full bg-slate-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Category Pill (Top Left) */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2 py-1 rounded-full border border-slate-200">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-slate-700 text-sm font-medium ml-1">{rating}</span>
          <span className="text-slate-400 text-sm ml-1">({reviewCount})</span>
        </div>

        <h3 className="text-slate-900 font-semibold text-lg leading-tight mb-2 line-clamp-2">
          {title}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs uppercase tracking-wide">Starting at</span>
            <span className="text-emerald-600 font-bold text-xl">${price}</span>
          </div>
          <button 
            onClick={() => onBook(service)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;