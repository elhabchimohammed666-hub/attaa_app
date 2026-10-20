import React, { useState } from 'react';
import { reportService } from '../services/api';
import { X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

const REASONS = [
  'Asking for money / Commercial sale',
  'Fraud or scam attempt',
  'Inappropriate or offensive content',
  'Item no longer available / unreachable',
  'Wrong information or fake photos',
  'Other',
];

export default function ReportModal({ item, onClose }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      setIsSubmitting(true);
      await reportService.submitReport({
        itemId: item._id,
        reason,
        details: details.trim(),
        contactInfo: contactInfo.trim(),
      });
      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5 text-rose-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-base text-slate-900">
              Report this Listing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Report Received</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              JazakAllah Khair for safeguarding the community. Our team will review this listing promptly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-slate-600">
              Reporting: <strong className="text-slate-800">{item?.title}</strong>
            </p>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Reason for reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-200"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what happened (e.g. seller asked for payment or delivery fee)..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Your Contact (Optional)
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone or email if our team needs more context"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Submit Report to Community Moderators'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
