import React, { useState } from 'react';
import aiService from '../services/aiService';

const HealthAnalyticsAI = ({ userData, wearableData }) => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Removed automatic AI analysis - now only triggered manually

  const generateAIAnalytics = async () => {
    setIsLoading(true);
    try {
      const aiResponse = await aiService.generateHealthAnalytics(userData, wearableData);
      setAnalytics(aiResponse);
    } catch (error) {
      console.error('Error generating AI health analytics:', error);
      // Fallback to basic analytics
      setAnalytics({
        overallHealthScore: 70,
        fertilityHealthScore: 75,
        riskAssessment: {
          high: [],
          medium: [],
          low: []
        },
        strengths: ['Basic health tracking in place'],
        areasForImprovement: [],
        trends: [],
        predictions: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '↗';
      case 'declining': return '↘';
      case 'stable': return '→';
      default: return '●';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-pink-600">
          AI-Powered Health Analytics
        </h3>
        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
              <span className="ml-2 text-sm text-gray-600">AI Analyzing...</span>
            </div>
          )}
          <button
            onClick={generateAIAnalytics}
            disabled={isLoading || !userData || Object.keys(userData).length === 0}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Analyzing...' : 'Start AI Analysis'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your health data and generating comprehensive insights...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Overall Health Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg border-2 ${getScoreBgColor(analytics.overallHealthScore)}`}>
              <h4 className="text-lg font-semibold mb-2">Overall Health Score</h4>
              <div className={`text-4xl font-bold ${getScoreColor(analytics.overallHealthScore)}`}>
                {analytics.overallHealthScore}/100
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Based on comprehensive health analysis
              </p>
            </div>
            
            <div className={`p-6 rounded-lg border-2 ${getScoreBgColor(analytics.fertilityHealthScore)}`}>
              <h4 className="text-lg font-semibold mb-2">Fertility Health Score</h4>
              <div className={`text-4xl font-bold ${getScoreColor(analytics.fertilityHealthScore)}`}>
                {analytics.fertilityHealthScore}/100
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Reproductive health optimization
              </p>
            </div>
          </div>

          {/* Risk Assessment */}
          {analytics.riskAssessment && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analytics.riskAssessment).map(([level, risks]) => (
                  <div key={level} className={`p-4 rounded-lg border ${getRiskColor(level)}`}>
                    <h5 className="font-semibold capitalize mb-2">{level} Risk</h5>
                    {risks.length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {risks.map((risk, index) => (
                          <li key={index}>• {risk}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">No {level} risks identified</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {analytics.strengths && analytics.strengths.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Health Strengths</h4>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <ul className="space-y-2">
                  {analytics.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center text-green-800">
                      <span className="mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Areas for Improvement */}
          {analytics.areasForImprovement && analytics.areasForImprovement.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Areas for Improvement</h4>
              <div className="space-y-4">
                {analytics.areasForImprovement.map((area, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">{area.area}</h5>
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Current:</strong> {area.currentStatus}
                    </p>
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Target:</strong> {area.target}
                    </p>
                    {area.actionPlan && area.actionPlan.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Action Plan:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {area.actionPlan.map((action, actionIndex) => (
                            <li key={actionIndex}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends */}
          {analytics.trends && analytics.trends.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Health Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.trends.map((trend, index) => (
                  <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-800">{trend.metric}</h5>
                      <span className="text-2xl">{getTrendIcon(trend.trend)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Trend:</strong> {trend.trend} ({trend.timeframe})
                    </p>
                    <p className="text-sm text-gray-700">{trend.significance}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictions */}
          {analytics.predictions && analytics.predictions.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Predictions</h4>
              <div className="space-y-4">
                {analytics.predictions.map((prediction, index) => (
                  <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-purple-800">{prediction.metric}</h5>
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {Math.round(prediction.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-purple-700 mb-1">
                      <strong>Prediction:</strong> {prediction.prediction}
                    </p>
                    <p className="text-sm text-purple-600">
                      <strong>Timeframe:</strong> {prediction.timeframe}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Click "Start AI Analysis" to generate comprehensive health insights</p>
          <p className="text-sm text-gray-500">AI will analyze your health data and provide personalized recommendations</p>
        </div>
      )}
    </div>
  );
};

export default HealthAnalyticsAI;
