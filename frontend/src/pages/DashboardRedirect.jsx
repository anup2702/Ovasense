import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the fertility dashboard
    navigate('/fertility');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-600 rounded-2xl shadow-lg mb-8">
          <svg className="w-10 h-10 text-pink-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Redirecting to Dashboard
        </h1>

        <p className="text-slate-600 font-light text-lg mb-8 max-w-md mx-auto">
          Taking you to your personalized fertility insights and analytics...
        </p>

        {/* Modern loading spinner */}
        <div className="flex justify-center mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-pink-600 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRedirect;
