import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SafetyBanner from './components/SafetyBanner';
import FilterBar from './components/FilterBar';
import ItemGrid from './components/ItemGrid';
import ItemDetailsModal from './components/ItemDetailsModal';
import CreateItemModal from './components/CreateItemModal';
import AuthModal from './components/AuthModal';
import MyItemsModal from './components/MyItemsModal';
import ReportModal from './components/ReportModal';
import Footer from './components/Footer';
import { itemService } from './services/api';
import { useAuth } from './context/AuthContext';
import {
  Gift,
  HeartHandshake,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const { isAuthenticated } = useAuth();

  // Item listings state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All');
  const [condition, setCondition] = useState('All');

  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({
    isOpen: false,
    mode: 'login',
  });
  const [isMyItemsModalOpen, setIsMyItemsModalOpen] = useState(false);
  const [reportItem, setReportItem] = useState(null);

  // Success toast state
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch items from backend
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        city: city !== 'All' ? city : undefined,
        condition: condition !== 'All' ? condition : undefined,
      };

      const res = await itemService.getAll(params);
      if (res.data?.success) {
        setItems(res.data.items);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching items:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, city, condition]);

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCity('All');
    setCondition('All');
    setPage(1);
  };

  const handleItemCreated = async (formData) => {
    const res = await itemService.create(formData);
    showToast('Alhamdulillah! Your free gift listing was published successfully.');
    fetchItems();
    return res;
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      await itemService.updateStatus(itemId, newStatus);
      showToast(`Item status updated to: ${newStatus}`);
      if (selectedItem && selectedItem._id === itemId) {
        setSelectedItem((prev) => ({ ...prev, status: newStatus }));
      }
      fetchItems();
    } catch (err) {
      alert(err.message || 'Failed to update item status');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await itemService.delete(itemId);
      showToast('Item listing removed.');
      if (selectedItem && selectedItem._id === itemId) {
        setSelectedItem(null);
      }
      fetchItems();
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Safety Notice Banner */}
      <SafetyBanner />

      {/* Navigation Header */}
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenAuthModal={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onOpenMyItemsModal={() => setIsMyItemsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-4 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Community Solidarity • في سبيل الله</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Give What You Don't Need,{' '}
            <span className="text-emerald-600 underline decoration-emerald-300 underline-offset-4">
              Free of Charge
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Attaa connects generous donors with people in need. Free furniture, clothes, electronics, appliances, and books — zero money, zero fees.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalConfig({ isOpen: true, mode: 'login' });
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              <span>Give an Item Now</span>
            </button>
            <a
              href="#listings-area"
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all"
            >
              Explore Available Gifts
            </a>
          </div>
        </div>

        {/* Listings Section */}
        <section id="listings-area">
          {/* Filter Bar */}
          <FilterBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            city={city}
            setCity={setCity}
            condition={condition}
            setCondition={setCondition}
            onResetFilters={handleResetFilters}
            totalItems={totalItems}
          />

          {/* Items Grid */}
          <ItemGrid
            items={items}
            loading={loading}
            onSelectItem={(item) => setSelectedItem(item)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-600 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdateStatus={handleUpdateStatus}
          onDeleteItem={handleDeleteItem}
          onOpenReportModal={(it) => {
            setSelectedItem(null);
            setReportItem(it);
          }}
        />
      )}

      {isCreateModalOpen && (
        <CreateItemModal
          onClose={() => setIsCreateModalOpen(false)}
          onItemCreated={handleItemCreated}
        />
      )}

      {authModalConfig.isOpen && (
        <AuthModal
          initialMode={authModalConfig.mode}
          onClose={() => setAuthModalConfig({ isOpen: false, mode: 'login' })}
        />
      )}

      {isMyItemsModalOpen && (
        <MyItemsModal
          onClose={() => setIsMyItemsModalOpen(false)}
          onSelectItem={(item) => setSelectedItem(item)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      {reportItem && (
        <ReportModal
          item={reportItem}
          onClose={() => setReportItem(null)}
        />
      )}
    </div>
  );
}
