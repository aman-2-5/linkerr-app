// --- SERVICE CARD (UPDATED WITH STARS) ---
const ServiceCard = ({ service }) => {
  const placeholderImg = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";

  return (
    <Link to={`/service/${service._id}`} className="block h-full"> 
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full cursor-pointer">
        <div className="relative h-48 w-full bg-slate-100">
          <img 
            src={service.thumbnail || placeholderImg} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2 py-1 rounded-full border border-slate-200">
            {service.category}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          {/* 👇 TITLE & RATING ROW */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-slate-900 font-semibold text-lg leading-tight line-clamp-2">{service.title}</h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700">
              <span>★</span>
              <span>{service.rating ? service.rating.toFixed(1) : "New"}</span>
              <span className="text-slate-400 font-normal">({service.numReviews || 0})</span>
            </div>
          </div>

          <p className="text-slate-500 text-sm line-clamp-2 mb-4">{service.description}</p>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs uppercase tracking-wide">Starting at</span>
              <span className="text-emerald-600 font-bold text-xl">${service.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};