import React, { useState, useEffect } from 'react';
import aiService from '../services/aiService';

const HealthAnalytics = ({ userData, wearableData }) => {
  // Calculate health scores
  const calculateHealthScores = () => {
    const scores = {};
    
    // Sleep Score (0-100)
    if (userData.sleepHours >= 8) {
      scores.Sleep = 100;
    } else if (userData.sleepHours >= 7) {
      scores.Sleep = 80;
    } else if (userData.sleepHours >= 6) {
      scores.Sleep = 60;
    } else {
      scores.Sleep = 30;
    }
    
    // Stress Score (0-100) - inverted scale
    scores['Stress Management'] = Math.max(0, 100 - (userData.stressLevel * 10));
    
    // Nutrition Score (0-100)
    const nutritionScores = { "Poor": 20, "Average": 50, "Good": 80, "Excellent": 100 };
    scores.Nutrition = nutritionScores[userData.nutritionQuality] || 50;
    
    // Hydration Score (0-100)
    if (userData.hydration >= 10) {
      scores.Hydration = 100;
    } else if (userData.hydration >= 8) {
      scores.Hydration = 80;
    } else if (userData.hydration >= 6) {
      scores.Hydration = 60;
    } else {
      scores.Hydration = 40;
    }
    
    // Exercise Score (0-100)
    const exerciseScores = { 
      "None": 20, 
      "1-2 times/week": 50, 
      "3-4 times/week": 80, 
      "5+ times/week": 90 
    };
    scores.Exercise = exerciseScores[userData.exerciseFrequency] || 50;
    
    // BBT Tracking Score (0-100)
    if (userData.bbtTracking === "Not Tracking") {
      scores['BBT Tracking'] = 0;
    } else if (userData.bbtConsistency >= 8) {
      scores['BBT Tracking'] = 100;
    } else if (userData.bbtConsistency >= 6) {
      scores['BBT Tracking'] = 70;
    } else {
      scores['BBT Tracking'] = 40;
    }
    
    return scores;
  };

  const healthScores = calculateHealthScores();
  const overallScore = Math.round(Object.values(healthScores).reduce((sum, score) => sum + score, 0) / Object.keys(healthScores).length);

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

  const getOverallScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverallScoreMessage = (score) => {
    if (score >= 80) return 'Excellent Health Profile: Your lifestyle choices strongly support reproductive health!';
    if (score >= 60) return 'Good Health Profile: You\'re on the right track with room for improvement.';
    if (score >= 40) return 'Moderate Health Profile: Consider focusing on key areas for better fertility outcomes.';
    return 'Health Profile Needs Attention: Prioritize lifestyle changes to support fertility.';
  };

  const getOverallScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-semibold text-pink-600 mb-6">
        Advanced Health Analytics Dashboard
      </h3>

      {/* Health Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(healthScores).map(([category, score]) => (
          <div
            key={category}
            className={`p-4 rounded-lg border-2 ${getScoreBgColor(score)}`}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-800">{category}</h4>
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Health Score */}
      <div className={`p-6 rounded-lg border-2 ${getOverallScoreBgColor(overallScore)} mb-6`}>
        <div className="text-center">
          <h4 className="text-lg font-medium text-gray-800 mb-2">Overall Health Score</h4>
          <div className={`text-4xl font-bold ${getOverallScoreColor(overallScore)} mb-2`}>
            {overallScore}/100
          </div>
          <p className={`text-sm ${getOverallScoreColor(overallScore)}`}>
            {getOverallScoreMessage(overallScore)}
          </p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment</h4>
        <div className="space-y-2">
          {(() => {
            const riskFactors = [];
            
            if (userData.sleepHours < 6) riskFactors.push("Sleep deprivation");
            if (userData.stressLevel >= 8) riskFactors.push("High stress levels");
            if (userData.exerciseFrequency === "None") riskFactors.push("Sedentary lifestyle");
            if (userData.nutritionQuality === "Poor") riskFactors.push("Poor nutrition");
            if (userData.alcoholConsumption === "Frequent") riskFactors.push("Excessive alcohol consumption");
            if (userData.smokingStatus === "Current smoker") riskFactors.push("Smoking");
            if (userData.healthConditions.includes("PCOS")) riskFactors.push("PCOS condition");
            if (userData.healthConditions.includes("Thyroid Issues")) riskFactors.push("Thyroid dysfunction");
            
            if (riskFactors.length === 0) {
              return (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    No significant risk factors identified - Great job maintaining a healthy lifestyle!
                  </p>
                </div>
              );
            }
            
            return (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium mb-2">
                  Identified Risk Factors: {riskFactors.join(', ')}
                </p>
                <p className="text-yellow-700 text-sm">
                  Recommendation: Address these risk factors to optimize your fertility health.
                </p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Wearable Data Analysis */}
      {wearableData && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Wearable Data Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wearableData.columns && wearableData.columns.map(column => {
              if (column.toLowerCase() === 'date') return null;
              
              const avgValue = wearableData[column]?.mean?.() || 0;
              let status = 'normal';
              let message = '';
              
              if (column.toLowerCase() === 'sleep') {
                if (avgValue < 6) {
                  status = 'warning';
                  message = 'Sleep below 6 hours — prioritize rest!';
                } else if (avgValue >= 8) {
                  status = 'success';
                  message = 'Great sleep patterns detected!';
                }
              } else if (column.toLowerCase() === 'steps') {
                if (avgValue < 3000) {
                  status = 'warning';
                  message = 'Low activity detected — aim for 7,000+ daily steps!';
                } else if (avgValue >= 7000) {
                  status = 'success';
                  message = 'Excellent activity levels tracked!';
                }
              }
              
              return (
                <div
                  key={column}
                  className={`p-4 rounded-lg border ${
                    status === 'success' ? 'bg-green-50 border-green-200' :
                    status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <h5 className="font-medium text-gray-800">{column}</h5>
                  <p className="text-2xl font-bold text-gray-700">{avgValue.toFixed(1)}</p>
                  {message && (
                    <p className={`text-sm ${
                      status === 'success' ? 'text-green-700' :
                      status === 'warning' ? 'text-yellow-700' :
                      'text-gray-600'
                    }`}>
                      {message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trend Analysis */}
      {wearableData && wearableData.length > 7 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Trend Analysis</h4>
          <div className="space-y-2">
            {['Sleep', 'Steps', 'BBT'].map(metric => {
              if (!wearableData[metric]) return null;
              
              // Simple trend calculation (first half vs second half)
              const midPoint = Math.floor(wearableData.length / 2);
              const firstHalf = wearableData[metric].slice(0, midPoint).mean?.() || 0;
              const secondHalf = wearableData[metric].slice(midPoint).mean?.() || 0;
              const trend = secondHalf - firstHalf;
              
              let trendMessage = '';
              let trendColor = '';
              
              if (trend > 0) {
                trendMessage = `${metric} showing positive trend (+${trend.toFixed(2)} per period)`;
                trendColor = 'text-green-600';
              } else if (trend < 0) {
                trendMessage = `${metric} showing declining trend (${trend.toFixed(2)} per period)`;
                trendColor = 'text-yellow-600';
              } else {
                trendMessage = `${metric} showing stable trend`;
                trendColor = 'text-gray-600';
              }
              
              return (
                <div key={metric} className="p-3 bg-gray-50 rounded-lg">
                  <p className={trendColor}>{trendMessage}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthAnalytics;
