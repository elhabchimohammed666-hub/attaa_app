import React from 'react';
import {
  Search,
  MapPin,
  Tag,
  Filter,
  Sparkles,
  RotateCcw,
  Shirt,
  Armchair,
  Tv,
  BookOpen,
  Baby,
  Cpu,
  Layers,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Items', icon: Layers },
  { id: 'Clothing', label: 'Clothing', icon: Shirt },
  { id: 'Home & Furniture', label: 'Furniture & Home', icon: Armchair },
  { id: 'Electronics', label: 'Electronics', icon: Tv },
  { id: 'Books', label: 'Books & Education', icon: BookOpen },
  { id: 'Kids & Toys', label: 'Kids & Toys', icon: Baby },
  { id: 'Appliances', label: 'Appliances', icon: Cpu },
  { id: 'Others', label: 'Others', icon: Tag },
];

const POPULAR_CITIES = [
  'All',
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tangier',
  'Fes',
  'Agadir',
  'Meknes',
  'Oujda',
  'Kenitra',
  'Tetouan',
];

const CONDITIONS = ['All', 'New', 'Excellent', 'Good', 'Needs Minor Repair'];

export default function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  city,
  setCity,
  condition,
  setCondition,
  onResetFilters,
  totalItems,
}) {
  const hasActiveFilters =
    search || category !== 'All' || city !== 'All' || condition !== 'All';

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-8 space-y-5">
      {/* Search & City row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items to find a gift (e.g., table, jacket, washing machine, books)..."
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl text-slate-900 placeholder-slate-400 text-sm md:text-base transition-all focus:ring-4 focus:ring-emerald-100 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="relative md:col-span-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-11 pr-8 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl text-slate-900 text-sm md:text-base appearance-none cursor-pointer transition-all focus:ring-4 focus:ring-emerald-100 outline-none"
          >
            <option value="All">All Cities (Whole Country)</option>
            {POPULAR_CITIES.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Browse By Category
          </label>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all select-none ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600 font-semibold'
                    : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-white' : 'text-slate-500'
                  }`}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Quick Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">
            Condition:
          </span>
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                condition === c
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c === 'All' ? 'Any Condition' : c}
            </button>
          ))}
        </div>

        {totalItems !== undefined && (
          <p className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-800">{totalItems}</strong> free gifts
          </p>
        )}
      </div>
    </div>
  );
}
