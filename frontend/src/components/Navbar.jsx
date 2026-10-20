import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Gift,
  PlusCircle,
  User,
  LogOut,
  Package,
  Menu,
  X,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar({
  onOpenCreateModal,
  onOpenAuthModal,
  onOpenMyItemsModal,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGiveItemClick = () => {
    if (!isAuthenticated) {
      onOpenAuthModal('login');
    } else {
      onOpenCreateModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Attaa
                </span>
                <span className="font-arabic text-xl font-bold text-emerald-600">
                  عطاء
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                100% Free Community Gifting • في سبيل الله
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Primary Action: Give an Item */}
            <button
              onClick={handleGiveItemClick}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-5 py-3 rounded-xl font-semibold shadow-md shadow-emerald-600/25 transition-all text-base focus:ring-4 focus:ring-emerald-200"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Give an Item</span>
            </button>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <button
                  onClick={onOpenMyItemsModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 font-medium text-sm transition-all"
                  title="View items you have listed"
                >
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>My Posted Items</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 truncate max-w-[120px]">
                      {user?.name}
                    </p>
                    <p className="text-slate-500 truncate max-w-[120px]">
                      {user?.city}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-2.5 rounded-xl text-slate-700 hover:text-emerald-700 font-semibold text-sm transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleGiveItemClick}
              className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm"
              title="Give an Item"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">
                    {user?.phone} • {user?.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateModal();
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Give an Item (Post for Free)</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyItemsModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                <Package className="w-5 h-5 text-emerald-600" />
                <span>My Posted Items</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateModal();
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Give an Item (Post for Free)</span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal('login');
                  }}
                  className="w-full py-3 rounded-xl border border-slate-300 text-slate-800 font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal('register');
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
