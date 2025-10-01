import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pink-50 relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-600 rounded-3xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo.png" 
                alt="OvaSense Logo" 
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 leading-tight">
              OvaSense
            </h1>
            <p className="text-xl md:text-2xl text-pink-600 font-light mb-2">
              AI-Powered Fertility Tracking
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-12 max-w-2xl mx-auto font-light">
            Take control of your reproductive health with intelligent insights,
            personalized tracking, and AI-driven predictions for your fertility journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => navigate('/fertility')}
              className="group px-8 py-4 bg-pink-600  font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px] hover:bg-pink-700"
            >
              <span className="flex items-center justify-center gap-2">
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-pink-500">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-pink-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Tracking</h3>
              <p className="text-slate-600 text-sm">Advanced algorithms analyze your data to provide accurate predictions and insights.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-orange-500">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-pink-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Insights</h3>
              <p className="text-slate-600 text-sm">Get personalized recommendations powered by machine learning and medical expertise.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-purple-500">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-pink-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Privacy First</h3>
              <p className="text-slate-600 text-sm">Your health data is encrypted and secure. We prioritize your privacy and data protection.</p>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-pink-100/20"></div>
      </div>
    </div>
  );
};

export default Landing;
