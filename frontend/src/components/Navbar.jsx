import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-slate-200/50 sticky top-0 z-50 rounded-b-2xl mx-4 mt-4">
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-4 group transform hover:scale-105 transition-all duration-300"
            >
              <img 
                src="/logo.png" 
                alt="OvaSense Logo" 
                className="w-10 h-10"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-pink-600 group-hover:text-purple-600 transition-all duration-300">
                  OvaSense
                </span>
                <span className="text-xs text-slate-500 font-medium -mt-1">AI Fertility Tracker</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => navigate('/')}
              className={`relative px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                isActive('/')
                  ? ' bg-pink-600 shadow-lg'
                  : ' hover:text-pink-50 bg-white/70 hover:bg-pink-600 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </span>
            </button>

            <button
              onClick={() => navigate('/fertility')}
              className={`relative px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                isActive('/fertility')
                  ? ' bg-pink-600 shadow-lg'
                  :  'hover:text-purple-600 bg-white/70 hover:bg-pink-600 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Fertility Tracker
              </span>
            </button>

            <button
              onClick={() => navigate('/consultation')}
              className={`relative px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                isActive('/consultation')
                  ? ' bg-emerald-600 shadow-lg'
                  : ' hover:text-purple-600 bg-white/70 hover:bg-emerald-600 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Consultation
              </span>
            </button>

            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`relative p-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                isMenuOpen 
                  ? 'bg-pink-600 text-pink-50 shadow-lg shadow-pink-200/50' 
                  : 'bg-white/70 hover:bg-pink-600 text-slate-700 hover:text-pink-50'
              }`}
            >
              <div className="relative w-6 h-6">
                <svg className={`w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-300 ${
                  isMenuOpen ? 'bg-white/80 opacity-100' : 'bg-pink-400 opacity-0 hover:opacity-100'
                }`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-sm rounded-b-2xl mt-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 pt-6 pb-8 space-y-4">
              {/* Mobile Menu Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-2xl mb-3">
                  <img 
                    src="/logo.png" 
                    alt="OvaSense Logo" 
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Navigation</h3>
                <p className="text-sm text-slate-500">Choose your destination</p>
              </div>
              <button
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className={`group block w-full text-left px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isActive('/')
                    ? 'text-pink-50 bg-pink-600 shadow-lg shadow-pink-200/50'
                    : 'text-slate-700 bg-white/80 hover:bg-pink-600 hover:text-pink-50 hover:shadow-lg hover:shadow-pink-200/30 border border-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors duration-300 ${
                    isActive('/') ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-white/20'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Home</div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isActive('/') ? 'text-pink-100' : 'text-slate-500 group-hover:text-pink-100'
                    }`}>
                      Back to homepage
                    </div>
                  </div>
                </div>
              </button>


              <button
                onClick={() => {
                  navigate('/fertility');
                  setIsMenuOpen(false);
                }}
                className={`group block w-full text-left px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isActive('/fertility')
                    ? 'text-pink-50 bg-pink-600 shadow-lg shadow-pink-200/50'
                    : 'text-slate-700 bg-white/80 hover:bg-pink-600 hover:text-pink-50 hover:shadow-lg hover:shadow-pink-200/30 border border-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors duration-300 ${
                    isActive('/fertility') ? 'bg-white/20' : 'bg-pink-100 group-hover:bg-white/20'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Fertility Tracker</div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isActive('/fertility') ? 'text-pink-100' : 'text-slate-500 group-hover:text-pink-100'
                    }`}>
                      Track your cycle & insights
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  navigate('/consultation');
                  setIsMenuOpen(false);
                }}
                className={`group block w-full text-left px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isActive('/consultation')
                    ? 'text-emerald-50 bg-emerald-600 shadow-lg shadow-emerald-200/50'
                    : 'text-slate-700 bg-white/80 hover:bg-emerald-600 hover:text-emerald-50 hover:shadow-lg hover:shadow-emerald-200/30 border border-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors duration-300 ${
                    isActive('/consultation') ? 'bg-white/20' : 'bg-emerald-100 group-hover:bg-white/20'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Consultation</div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isActive('/consultation') ? 'text-emerald-100' : 'text-slate-500 group-hover:text-emerald-100'
                    }`}>
                      Book expert consultation
                    </div>
                  </div>
                </div>
              </button>

              {/* Mobile Menu Footer */}
              <div className="pt-6 mt-6 border-t border-slate-200/50">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-2">
                    <span>Powered by</span>
                    <div className="w-4 h-4 bg-pink-600 rounded flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span>Team Async</span>
                  </div>
                  <p className="text-xs text-slate-400">Made for women's health</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
