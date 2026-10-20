import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Upload,
  Camera,
  Trash2,
  CheckCircle,
  AlertCircle,
  Gift,
  HeartHandshake,
} from 'lucide-react';

const CATEGORIES = [
  'Clothing',
  'Home & Furniture',
  'Electronics',
  'Books',
  'Kids & Toys',
  'Appliances',
  'Others',
];

const CONDITIONS = ['New', 'Excellent', 'Good', 'Needs Minor Repair'];

const POPULAR_CITIES = [
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

export default function CreateItemModal({ onClose, onItemCreated }) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[1]); // 'Excellent'
  const [city, setCity] = useState(user?.city || POPULAR_CITIES[0]);
  const [neighborhood, setNeighborhood] = useState(user?.neighborhood || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isFreeRuleChecked, setIsFreeRuleChecked] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle image files selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (selectedFiles.length + files.length > 5) {
      setErrorMessage('You can upload a maximum of 5 photos.');
      return;
    }

    setErrorMessage('');
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Create local object URLs for instant preview
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter an item title.');
      return;
    }

    if (!contactPhone.trim()) {
      setErrorMessage('Please provide a WhatsApp or contact phone number.');
      return;
    }

    if (selectedFiles.length === 0) {
      setErrorMessage('Please upload at least 1 photo of the item.');
      return;
    }

    if (!isFreeRuleChecked) {
      setErrorMessage('You must confirm that this item is 100% free.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('city', city.trim());
      formData.append('neighborhood', neighborhood.trim());
      formData.append('contactPhone', contactPhone.trim());
      formData.append('description', description.trim());
      formData.append('allowWhatsApp', 'true');

      // Append image files
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await onItemCreated(formData);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to list item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Give an Item (Fi Sabilillah)
              </h3>
              <p className="text-xs text-slate-500">
                List an item for free donation to someone in need
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Washing Machine in good condition, Winter Jacket (XL)..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-slate-900 placeholder-slate-400 text-base outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Condition <span className="text-rose-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all cursor-pointer"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City & Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="city-options"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Casablanca, Rabat..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
              />
              <datalist id="city-options">
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Neighborhood / District
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Maarif, Agdal, Downtown..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {/* WhatsApp / Phone Contact */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Contact Phone / WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. +212612345678 or 0612345678"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Beneficiaries will use this to contact you directly via WhatsApp or phone call.
            </p>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Photos (1 to 5 images) <span className="text-rose-500">*</span>
            </label>

            {/* Drag & drop / click zone */}
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all">
              <Camera className="w-8 h-8 text-emerald-600 mb-2" />
              <span className="text-sm font-semibold text-slate-700">
                Click or tap to upload photos
              </span>
              <span className="text-xs text-slate-400 mt-1">
                JPEG, PNG, or WebP (up to 5MB each)
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 group shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-rose-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Description (Optional Details)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any helpful details (dimensions, pickup instructions, reasons for gifting)..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
            />
          </div>

          {/* Zero Commerce & Fi Sabilillah Checkbox */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="freeRule"
              checked={isFreeRuleChecked}
              onChange={(e) => setIsFreeRuleChecked(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded-lg border-slate-300 focus:ring-emerald-500 mt-0.5 cursor-pointer"
            />
            <label
              htmlFor="freeRule"
              className="text-xs text-emerald-950 leading-relaxed cursor-pointer font-medium"
            >
              <strong>Fi Sabilillah Declaration:</strong> I certify that this item is being gifted 100% FREE without any demand for money, transport fees, or trades.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Your Gift...</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-5 h-5" />
                  <span>Publish Free Donation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
