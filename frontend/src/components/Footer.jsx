import React from 'react';
import { Gift, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Attaa <span className="font-arabic text-emerald-400">عطاء</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Attaa is a non-profit, community-powered platform uniting generous hearts with families and individuals in need. We believe unwanted items are blessings waiting for a new home.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-3.5 h-3.5" />
                Fi Sabilillah • 100% Free Always
              </span>
            </div>
          </div>

          {/* Core Values */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Community Principles
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>No Buying, No Selling:</strong> Zero money exchanges hands.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Dignity & Respect:</strong> Courteous communication at all times.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Eco-friendly:</strong> Reducing landfill waste through circular reuse.</span>
              </li>
            </ul>
          </div>

          {/* Spiritual Quote / Safe Gifting */}
          <div className="md:col-span-3 space-y-2 bg-slate-800/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Reminder</span>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "And whatever good you put forward for yourselves, you will find it with Allah. It is better and greater in reward."
            </p>
            <p className="text-[10px] text-slate-500 font-semibold">— Surah Al-Muzzammil 73:20</p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Attaa Platform. Built with care for the community.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by the MERN Stack</span>
            <span>•</span>
            <span className="text-emerald-400">Fi Sabilillah</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
