import React, { useState } from 'react';
import { ShieldAlert, HeartHandshake, X } from 'lucide-react';

export default function SafetyBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-4 py-3 shadow-md border-b border-emerald-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-full hidden sm:flex text-emerald-300">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                100% Free Guarantee
              </span>
              <p className="text-sm font-semibold text-emerald-100">
                Fi Sabilillah • Absolutely No Buying or Selling
              </p>
            </div>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              All items on Attaa are gifts. Never send money, courier fees, or advance payments.
            </p>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss banner"
          className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
