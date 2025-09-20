import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const DashboardRedirect = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');

  useEffect(() => {
    // Redirect to Streamlit app with user ID
    const streamlitURL = `https://ovasense.streamlit.app?uid=${uid}`;
    window.location.href = streamlitURL;
  }, [uid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-8 pulse-modern">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">
          Redirecting to Dashboard
        </h1>

        <p className="text-slate-600 font-light text-lg mb-8 max-w-md mx-auto">
          Taking you to your personalized fertility insights and analytics...
        </p>

        {/* Modern loading spinner */}
        <div className="flex justify-center mb-8">
          <div className="spinner-modern"></div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-indigo-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>

        {/* Subtle background pattern */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default DashboardRedirect;
