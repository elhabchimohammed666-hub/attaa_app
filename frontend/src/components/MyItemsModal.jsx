import React, { useState, useEffect } from 'react';
import { itemService } from '../services/api';
import {
  X,
  Package,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function MyItemsModal({
  onClose,
  onSelectItem,
  onOpenCreateModal,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const res = await itemService.getMyItems();
      setItems(res.data?.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load your items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      setActionInProgress(itemId);
      await itemService.updateStatus(itemId, newStatus);
      setItems((prev) =>
        prev.map((it) => (it._id === itemId ? { ...it, status: newStatus } : it))
      );
    } catch (err) {
      alert(err.message || 'Could not update status.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) {
      return;
    }
    try {
      setActionInProgress(itemId);
      await itemService.delete(itemId);
      setItems((prev) => prev.filter((it) => it._id !== itemId));
    } catch (err) {
      alert(err.message || 'Could not delete item.');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                My Posted Items
              </h3>
              <p className="text-xs text-slate-500">
                Manage your listings and mark items as Given Away
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 bg-slate-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 mb-1">
                You haven't posted any items yet
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                Have things at home you no longer use? Give them away Fi Sabilillah.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateModal();
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm"
              >
                Post Your First Gift
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={
                        item.images?.[0] ||
                        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.status === 'Donated'
                              ? 'bg-slate-200 text-slate-700'
                              : item.status === 'Reserved'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.status === 'Donated' ? 'Given Away' : item.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.category} • {item.city}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    {item.status !== 'Donated' ? (
                      <button
                        onClick={() => handleStatusChange(item._id, 'Donated')}
                        disabled={actionInProgress === item._id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                      >
                        Mark as Given Away
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(item._id, 'Available')}
                        disabled={actionInProgress === item._id}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                      >
                        Make Available
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onClose();
                        onSelectItem(item);
                      }}
                      className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 rounded-xl"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={actionInProgress === item._id}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
