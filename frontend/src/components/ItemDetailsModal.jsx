import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Share2,
  Heart,
  ShieldCheck,
  User,
  ExternalLink,
} from 'lucide-react';

export default function ItemDetailsModal({
  item,
  onClose,
  onUpdateStatus,
  onDeleteItem,
  onOpenReportModal,
}) {
  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!item) return null;

  const isOwner = user && (user._id === item.user?._id || user._id === item.user);

  // Clean phone number for WhatsApp link (strip non-digits, keep leading country code if present)
  const rawPhone = item.contactPhone || item.user?.phone || '';
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Salam Alaykum! I saw your free listing for "${item.title}" on the Attaa community platform. Is it still available? JazakAllah Khair!`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${whatsappMessage}`;
  const phoneCallUrl = `tel:${cleanPhone}`;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    await onUpdateStatus(item._id, newStatus);
    setIsUpdatingStatus(false);
  };

  const statusConfig = {
    Available: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      label: 'Available (Free Gift)',
    },
    Reserved: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      label: 'Reserved (Pending Pickup)',
    },
    Donated: {
      badge: 'bg-slate-200 text-slate-800 border-slate-300',
      label: 'Given Away / Donated',
    },
  };

  const currentStatus = statusConfig[item.status] || statusConfig.Available;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close and Share */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${currentStatus.badge}`}
            >
              {currentStatus.label}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-full">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 text-center">
            Link copied to clipboard! Share it with someone in need.
          </div>
        )}

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Column: Images */}
          <div className="md:col-span-7 p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Main Image */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-inner relative">
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[activeImageIndex]
                      : 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-xl">
                  {item.condition} Condition
                </div>
              </div>

              {/* Thumbnails if multiple images */}
              {item.images && item.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 shadow-md ring-2 ring-emerald-200'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Guarantee Reminder */}
            <div className="mt-4 p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>100% Free Guarantee:</strong> The donator gives this item freely Fi Sabilillah. No money, fee, or transaction is permitted.
              </p>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-snug">
                  {item.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">
                    {item.city}
                    {item.neighborhood ? `, ${item.neighborhood}` : ''}
                  </span>
                  <span>•</span>
                  <span>
                    Posted {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  About this item
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {item.description || 'No additional description provided by the donator.'}
                </p>
              </div>

              {/* Donator Info Card */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                    {item.user?.name ? item.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {item.user?.name || 'Community Donator'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Gifting Fi Sabilillah • {item.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="space-y-3 pt-6 border-t border-slate-100 mt-6">
              {/* Owner Controls */}
              {isOwner ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Listing Owner Controls
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {item.status !== 'Donated' ? (
                      <button
                        onClick={() => handleStatusChange('Donated')}
                        disabled={isUpdatingStatus}
                        className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Mark as Given Away / Donated</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange('Available')}
                        disabled={isUpdatingStatus}
                        className="col-span-2 py-2.5 px-4 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-900 transition-all"
                      >
                        Re-open as Available
                      </button>
                    )}

                    {item.status === 'Available' && (
                      <button
                        onClick={() => handleStatusChange('Reserved')}
                        disabled={isUpdatingStatus}
                        className="py-2.5 px-3 rounded-xl border border-amber-400 bg-amber-50 text-amber-900 font-semibold text-xs hover:bg-amber-100 transition-colors"
                      >
                        Mark as Reserved
                      </button>
                    )}

                    {item.status === 'Reserved' && (
                      <button
                        onClick={() => handleStatusChange('Available')}
                        disabled={isUpdatingStatus}
                        className="py-2.5 px-3 rounded-xl border border-emerald-400 bg-emerald-50 text-emerald-900 font-semibold text-xs hover:bg-emerald-100 transition-colors"
                      >
                        Mark as Available
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this listing?')) {
                          onDeleteItem(item._id);
                          onClose();
                        }
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Listing</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Contact Actions for Community Members */
                <div className="space-y-2.5">
                  {item.status === 'Donated' ? (
                    <div className="text-center py-4 px-4 bg-slate-100 rounded-2xl text-slate-600 font-semibold text-sm">
                      ✨ This item has already been given away to someone in need.
                    </div>
                  ) : (
                    <>
                      {/* WhatsApp Direct Action Button */}
                      {cleanPhone && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-bold text-base shadow-lg shadow-emerald-600/30 transition-all focus:ring-4 focus:ring-emerald-200"
                        >
                          <MessageCircle className="w-5 h-5 fill-current" />
                          <span>Contact via WhatsApp</span>
                        </a>
                      )}

                      {/* Direct Phone Call Button */}
                      {cleanPhone && (
                        <a
                          href={phoneCallUrl}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all"
                        >
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <span>Call Donator ({item.contactPhone})</span>
                        </a>
                      )}
                    </>
                  )}

                  {/* Report Button */}
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => onOpenReportModal(item)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report listing (Fraud, charging money, etc.)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
