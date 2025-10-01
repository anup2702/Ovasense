import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-pink-50 text-slate-900 overflow-hidden">
        {/* Bottom section */}
        <div className="border-t border-pink-200 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-slate-600 text-sm">
            © 2025 OvaSense. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-slate-600 text-sm">Made for women's health</span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Powered by</span>
              <div className="w-5 h-5 bg-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-pink-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>Team Async</span>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
