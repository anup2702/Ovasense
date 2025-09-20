import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setShowProfileDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-pink-600 to-purple-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600 transition-all duration-300">
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
              className={`relative px-5 py-3 rounded-2xl font-semibold transition-all duration-300 group overflow-hidden ${
                isActive('/')
                  ? 'text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-200/50'
                  : 'text-slate-700 hover:text-white bg-white/70 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 shadow-md hover:shadow-lg hover:shadow-pink-200/30'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </span>
              {isActive('/') && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl"></div>
              )}
            </button>

            {/* Get Started Button - Only show when user is NOT logged in */}
            {!user && (
              <button
                onClick={() => navigate('/auth')}
                className={`relative px-5 py-3 rounded-2xl font-semibold transition-all duration-300 group overflow-hidden ${
                  isActive('/auth')
                    ? 'text-white bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg shadow-purple-200/50'
                    : 'text-slate-700 hover:text-white bg-white/70 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 shadow-md hover:shadow-lg hover:shadow-purple-200/30'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Started
                </span>
                {isActive('/auth') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl"></div>
                )}
              </button>
            )}


            {/* Profile Section - Only show when user is logged in */}
            {user && (
              <div className="relative ml-4 flex gap-6">
                <button
              onClick={() => navigate('/dashboard')}
              className={`relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 group overflow-hidden ${
                isActive('/dashboard')
                  ? 'text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-200/50 transform scale-105'
                  : 'text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:shadow-xl hover:shadow-indigo-200/30 transform hover:scale-105'
              }`}
            >
              <span className="h-4 relative z-10 flex items-center gap-2">
                <svg className="w-4 h-" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
    
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-2xl bg-white/70 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 text-slate-700 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                    {/* Demo girl image */}
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
                      alt="Profile"
                      className="w-10 h-10 rounded-xl object-cover"
                      onError={(e) => {
                        // Fallback to default icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <svg
                      className="w-6 h-6 text-white hidden"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{display: 'none'}}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold">{user.displayName || 'User'}</p>
                    <p className="text-xs opacity-75">{user.email?.split('@')[0]}</p>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/50 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                          {/* Demo girl image in dropdown */}
                          <img
                            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
                            alt="Profile"
                            className="w-12 h-12 rounded-xl object-cover"
                            onError={(e) => {
                              // Fallback to default icon if image fails to load
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <svg
                            className="w-7 h-7 text-white hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{display: 'none'}}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.displayName || 'User'}</p>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-slate-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-slate-900 transition-all duration-300 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative p-3 rounded-2xl bg-white/70 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 text-slate-700 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <div className="relative w-6 h-6">
                <svg className={`w-6 h-6 transition-all duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-sm rounded-b-2xl mt-4">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  isActive('/')
                    ? 'text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg'
                    : 'text-slate-700 bg-white/70 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </div>
              </button>

              {/* Get Started Button - Only show when user is NOT logged in */}
              {!user && (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    isActive('/auth')
                      ? 'text-white bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg'
                      : 'text-slate-700 bg-white/70 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Started
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </div>
              </button>

              {/* Mobile Profile Section */}
              {user && (
                <div className="border-t border-slate-200/50 pt-4 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                      {/* Demo girl image in mobile */}
                      <img
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
                        alt="Profile"
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => {
                          // Fallback to default icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <svg
                        className="w-7 h-7 text-white hidden"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{display: 'none'}}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.displayName || 'User'}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-slate-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-slate-900 transition-all duration-300 rounded-2xl mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-300 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
