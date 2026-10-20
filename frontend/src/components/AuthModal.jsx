import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Phone, Mail, User, MapPin, AlertCircle, Check } from 'lucide-react';

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

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState(POPULAR_CITIES[0]);
  const [regNeighborhood, setRegNeighborhood] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMessage('Please provide your phone/email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regPhone.trim() || !regCity.trim() || !regPassword) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim() || undefined,
        city: regCity.trim(),
        neighborhood: regNeighborhood.trim(),
        password: regPassword,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`text-lg font-bold pb-2 transition-all border-b-2 ${
                mode === 'login'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`text-lg font-bold pb-2 transition-all border-b-2 ${
                mode === 'register'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. +212612345678 or you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In to Attaa'
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Fatima Zahra"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+212612345678"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none cursor-pointer"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Neighborhood
                </label>
                <input
                  type="text"
                  value={regNeighborhood}
                  onChange={(e) => setRegNeighborhood(e.target.value)}
                  placeholder="District..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Create Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-900 text-sm outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Community Account'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
