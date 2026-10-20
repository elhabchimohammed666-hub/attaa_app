import React from 'react';
import { MapPin, Clock, MessageCircle, HeartHandshake, Eye } from 'lucide-react';

export default function ItemCard({ item, onSelectItem }) {
  // Format relative time
  const getTimeAgo = (dateString) => {
    const diff = (new Date() - new Date(dateString)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Status styling
  const statusConfig = {
    Available: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-500',
      label: 'Available',
    },
    Reserved: {
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
      label: 'Reserved',
    },
    Donated: {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      dot: 'bg-slate-400',
      label: 'Given Away',
    },
  };

  const status = statusConfig[item.status] || statusConfig.Available;

  // Image source: handle full URLs or local backend relative paths
  const imageSrc = item.images && item.images.length > 0
    ? item.images[0].startsWith('http')
      ? item.images[0]
      : `${item.images[0]}`
    : 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80';

  return (
    <article
      onClick={() => onSelectItem(item)}
      className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Free Gift Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% FREE</span>
        </div>

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-xl border backdrop-blur-md shadow-sm flex items-center gap-1.5 ${status.bg}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
          <span>{status.label}</span>
        </div>

        {/* Image count pill if multiple */}
        {item.images && item.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg">
            +{item.images.length - 1} photos
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition tags */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {item.category}
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {item.condition}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {item.title}
          </h3>

          {/* Description preview */}
          {item.description && (
            <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Footer info: Location, Time, Donator */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate max-w-[170px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {item.city}
              {item.neighborhood ? `, ${item.neighborhood}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTimeAgo(item.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
