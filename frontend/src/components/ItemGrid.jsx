import React from 'react';
import ItemCard from './ItemCard';
import { Gift, Sparkles, Inbox } from 'lucide-react';

export default function ItemGrid({
  items,
  loading,
  onSelectItem,
  onOpenCreateModal,
  onResetFilters,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-[4/3] bg-slate-200 rounded-2xl w-full" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-6 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-1/2 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No Free Items Found
        </h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          We couldn't find any items matching your current filters or search term. Try resetting your filters, or be the generous soul who lists an item today!
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors"
          >
            Give an Item (Post for Free)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onSelectItem={onSelectItem} />
      ))}
    </div>
  );
}
