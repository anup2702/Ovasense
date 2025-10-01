import React, { useState } from 'react';
import aiService from '../services/aiService';

const PersonalizedRecommendations = ({ userData, wearableData, fertilityPrediction }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [lifestyleTips, setLifestyleTips] = useState([]);
  const [healthOptimization, setHealthOptimization] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Removed automatic AI recommendations - now only triggered manually

  const generateAIRecommendations = async () => {
    setIsLoading(true);
    try {
      const aiResponse = await aiService.generatePersonalizedRecommendations(
        userData, 
        wearableData, 
        fertilityPrediction
      );
      
      setRecommendations(aiResponse.recommendations || []);
      setLifestyleTips(aiResponse.lifestyleTips || []);
      setHealthOptimization(aiResponse.healthOptimization || {});
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      // Fallback to basic recommendations
      setRecommendations([{
        type: 'info',
        title: 'AI Recommendations Unavailable',
        message: 'Please set up your Gemini API key for personalized AI recommendations.',
        details: ['Check the setup guide for API key configuration'],
        priority: 'medium'
      }]);
      setLifestyleTips([]);
      setHealthOptimization({
        immediateActions: ['Set up AI API key'],
        longTermGoals: ['Get personalized AI insights'],
        monitoringSuggestions: ['Track your health data consistently']
      });
    } finally {
      setIsLoading(false);
    }
  };


  const getRecommendationStyle = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-purple-600">
          Personalized AI Recommendations
        </h3>
        <button
          onClick={generateAIRecommendations}
          disabled={isLoading || !userData || Object.keys(userData).length === 0}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Generating...' : 'Generate Recommendations'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your data and generating personalized recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Click "Generate Recommendations" to get AI-powered personalized insights</p>
          <p className="text-sm text-gray-500">AI will analyze your data and provide tailored recommendations for your health journey</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${getRecommendationStyle(rec.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{rec.title}</h4>
                    {rec.priority && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                    )}
                  </div>
                  <p className="mb-2">{rec.message}</p>
                  {rec.details && (
                    <ul className="list-disc list-inside space-y-1">
                      {rec.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm">{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI-Generated Lifestyle Tips */}
      {lifestyleTips.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">AI-Generated Lifestyle Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifestyleTips.map((tip, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                tip.category === 'Sleep' ? 'bg-pink-50 border-pink-200' :
                tip.category === 'Nutrition' ? 'bg-green-50 border-green-200' :
                tip.category === 'Exercise' ? 'bg-blue-50 border-blue-200' :
                tip.category === 'Stress' ? 'bg-purple-50 border-purple-200' :
                tip.category === 'Hydration' ? 'bg-cyan-50 border-cyan-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <h5 className={`font-medium mb-2 ${
                  tip.category === 'Sleep' ? 'text-pink-800' :
                  tip.category === 'Nutrition' ? 'text-green-800' :
                  tip.category === 'Exercise' ? 'text-blue-800' :
                  tip.category === 'Stress' ? 'text-purple-800' :
                  tip.category === 'Hydration' ? 'text-cyan-800' :
                  'text-gray-800'
                }`}>
                  {tip.title}
                </h5>
                <p className={`text-sm ${
                  tip.category === 'Sleep' ? 'text-pink-700' :
                  tip.category === 'Nutrition' ? 'text-green-700' :
                  tip.category === 'Exercise' ? 'text-blue-700' :
                  tip.category === 'Stress' ? 'text-purple-700' :
                  tip.category === 'Hydration' ? 'text-cyan-700' :
                  'text-gray-700'
                }`}>
                  {tip.description}
                </p>
                {tip.actionable && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Actionable
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Optimization Actions */}
      {healthOptimization && Object.keys(healthOptimization).length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Health Optimization Plan</h4>
          
          {healthOptimization.immediateActions && healthOptimization.immediateActions.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium text-red-800 mb-2">🚨 Immediate Actions</h5>
              <ul className="list-disc list-inside space-y-1">
                {healthOptimization.immediateActions.map((action, index) => (
                  <li key={index} className="text-sm text-red-700">{action}</li>
                ))}
              </ul>
            </div>
          )}

          {healthOptimization.longTermGoals && healthOptimization.longTermGoals.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium text-blue-800 mb-2">Long-term Goals</h5>
              <ul className="list-disc list-inside space-y-1">
                {healthOptimization.longTermGoals.map((goal, index) => (
                  <li key={index} className="text-sm text-blue-700">{goal}</li>
                ))}
              </ul>
            </div>
          )}

          {healthOptimization.monitoringSuggestions && healthOptimization.monitoringSuggestions.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium text-green-800 mb-2">Monitoring Suggestions</h5>
              <ul className="list-disc list-inside space-y-1">
                {healthOptimization.monitoringSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-green-700">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Professional Consultation */}
      <div className="mt-8 p-4 bg-pink-50 border border-pink-200 rounded-lg">
        <h4 className="text-lg font-semibold text-pink-800 mb-2">Need Expert Help?</h4>
        <p className="text-pink-700 mb-4">
          For personalized medical advice and comprehensive fertility care, consider booking a consultation with a healthcare professional.
        </p>
        <a
          href="/consultation"
          className="inline-block bg-pink-600 text-pink-50 px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
        >
          Book Teleconsultation
        </a>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
