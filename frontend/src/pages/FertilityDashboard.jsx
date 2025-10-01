import React, { useState, useEffect, useCallback } from 'react';
import FertilityCalendar from '../components/FertilityCalendar';
import HealthAnalyticsAI from '../components/HealthAnalyticsAI';
import WearableDataUpload from '../components/WearableDataUpload';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import FertilityChatbot from '../components/FertilityChatbot';
import aiService from '../services/aiService';

const FertilityDashboard = () => {
  const [userData, setUserData] = useState({
    // Menstrual Cycle Data
    startDate: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    periodDuration: 5,
    flowIntensity: 'Normal',
    
    // Basal Body Temperature
    currentBBT: 97.5,
    bbtTracking: 'Not Tracking',
    bbtConsistency: 5,
    
    // Lifestyle Habits
    stressLevel: 5,
    hydration: 8,
    nutritionQuality: 'Good',
    sleepHours: 8,
    exerciseFrequency: '3-4 times/week',
    alcoholConsumption: 'Occasional',
    smokingStatus: 'Non-smoker',
    
    // Health & Supplements
    supplements: [],
    medications: '',
    healthConditions: []
  });

  const [fertilityPrediction, setFertilityPrediction] = useState(null);
  const [wearableData, setWearableData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionGenerated, setPredictionGenerated] = useState(false);

  const loadUserData = useCallback(() => {
    try {
      const savedData = localStorage.getItem('fertilityUserData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setUserData(prevData => ({ ...prevData, ...parsedData }));
      }
    } catch {
      // Error loading user data - continue with default values
    }
  }, []);

  // Load user data from localStorage on component mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const saveUserData = () => {
    try {
      localStorage.setItem('fertilityUserData', JSON.stringify(userData));
      alert('Data saved successfully!');
    } catch {
      alert('Error saving data. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const predictFertility = async () => {
    setIsLoading(true);
    
    try {
      // Use AI service for fertility predictions
      const prediction = await aiService.generateFertilityPrediction(userData, wearableData);
      if (prediction) {
        setFertilityPrediction(prediction);
      } else {
        throw new Error('No prediction returned from AI service');
      }
    } catch {
      // Fallback to basic prediction if AI fails
      const startDate = new Date(userData.startDate);
      const cycleLength = userData.cycleLength || 28;
      
      const fertileWindowStart = new Date(startDate);
      fertileWindowStart.setDate(fertileWindowStart.getDate() + cycleLength - 20);
      
      const fertileWindowEnd = new Date(fertileWindowStart);
      fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 6);
      
      const ovulationDay = new Date(fertileWindowStart);
      ovulationDay.setDate(ovulationDay.getDate() + 3);

      const fallbackPrediction = {
        fertileStart: fertileWindowStart,
        fertileEnd: fertileWindowEnd,
        ovulation: ovulationDay,
        adjustments: {
          confidenceScore: 0.6,
          insights: ['Basic prediction - AI analysis unavailable'],
          recommendations: ['Set up AI API key for advanced predictions'],
          riskFactors: [],
          nextSteps: ['Continue tracking your cycle data']
        }
      };
      
      setFertilityPrediction(fallbackPrediction);
    } finally {
      setIsLoading(false);
      setPredictionGenerated(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPredictionGenerated(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-4">
            AI-Powered Fertility Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Track your cycle, upload wearable data, and get personalized fertility predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Data Collection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-pink-600 mb-6">
                Health Data Collection
              </h2>
              
              {/* Menstrual Cycle Data */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Menstrual Cycle Data</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Period Start Date
                    </label>
                    <input
                      type="date"
                      value={userData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Cycle Length (days)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="40"
                      value={userData.cycleLength}
                      onChange={(e) => handleInputChange('cycleLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period Duration (days)
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={userData.periodDuration}
                      onChange={(e) => handleInputChange('periodDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flow Intensity
                    </label>
                    <select
                      value={userData.flowIntensity}
                      onChange={(e) => handleInputChange('flowIntensity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Light">Light</option>
                      <option value="Normal">Normal</option>
                      <option value="Heavy">Heavy</option>
                      <option value="Very Heavy">Very Heavy</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Basal Body Temperature */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Basal Body Temperature</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current BBT (°F)
                    </label>
                    <input
                      type="number"
                      min="96.0"
                      max="100.0"
                      step="0.1"
                      value={userData.currentBBT}
                      onChange={(e) => handleInputChange('currentBBT', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BBT Tracking Method
                    </label>
                    <select
                      value={userData.bbtTracking}
                      onChange={(e) => handleInputChange('bbtTracking', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Not Tracking">Not Tracking</option>
                      <option value="Oral">Oral</option>
                      <option value="Vaginal">Vaginal</option>
                      <option value="Rectal">Rectal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BBT Measurement Consistency (1-10): {userData.bbtConsistency}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={userData.bbtConsistency}
                      onChange={(e) => handleInputChange('bbtConsistency', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle Habits */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Lifestyle Habits</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stress Level (1-10): {userData.stressLevel}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={userData.stressLevel}
                      onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Water Intake (cups): {userData.hydration}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={userData.hydration}
                      onChange={(e) => handleInputChange('hydration', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nutrition Quality
                    </label>
                    <select
                      value={userData.nutritionQuality}
                      onChange={(e) => handleInputChange('nutritionQuality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Poor">Poor</option>
                      <option value="Average">Average</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Sleep Hours: {userData.sleepHours}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      value={userData.sleepHours}
                      onChange={(e) => handleInputChange('sleepHours', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exercise Frequency
                    </label>
                    <select
                      value={userData.exerciseFrequency}
                      onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="None">None</option>
                      <option value="1-2 times/week">1-2 times/week</option>
                      <option value="3-4 times/week">3-4 times/week</option>
                      <option value="5+ times/week">5+ times/week</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alcohol Consumption
                    </label>
                    <select
                      value={userData.alcoholConsumption}
                      onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="None">None</option>
                      <option value="Occasional">Occasional</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Frequent">Frequent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Smoking Status
                    </label>
                    <select
                      value={userData.smokingStatus}
                      onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="Non-smoker">Non-smoker</option>
                      <option value="Former smoker">Former smoker</option>
                      <option value="Current smoker">Current smoker</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Health & Supplements */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Health & Supplements</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Supplements
                    </label>
                    <div className="space-y-2">
                      {['Folic Acid', 'Prenatal Vitamins', 'Iron', 'Vitamin D', 'Omega-3', 'Probiotics', 'Other'].map(supplement => (
                        <label key={supplement} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={userData.supplements.includes(supplement)}
                            onChange={(e) => {
                              const newSupplements = e.target.checked
                                ? [...userData.supplements, supplement]
                                : userData.supplements.filter(s => s !== supplement);
                              handleInputChange('supplements', newSupplements);
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{supplement}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medications
                    </label>
                    <textarea
                      value={userData.medications}
                      onChange={(e) => handleInputChange('medications', e.target.value)}
                      placeholder="List any medications you're taking..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Conditions
                    </label>
                    <div className="space-y-2">
                      {['PCOS', 'Endometriosis', 'Thyroid Issues', 'Diabetes', 'High Blood Pressure', 'Other'].map(condition => (
                        <label key={condition} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={userData.healthConditions.includes(condition)}
                            onChange={(e) => {
                              const newConditions = e.target.checked
                                ? [...userData.healthConditions, condition]
                                : userData.healthConditions.filter(c => c !== condition);
                              handleInputChange('healthConditions', newConditions);
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={saveUserData}
                  className="w-full bg-pink-600 py-2 px-4 rounded-md hover:bg-pink-700 transition-colors font-medium"
                >
                  Save Data
                </button>
                
                <button
                  onClick={predictFertility}
                  disabled={isLoading}
                  className="w-full bg-purple-600 py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Predicting...' : 'Predict Fertile Window (Advanced AI Model)'}
                </button>
              </div>
            </div>

            {/* Wearable Data Upload */}
            <WearableDataUpload 
              onDataUpload={setWearableData}
              wearableData={wearableData}
              userData={userData}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Success Message */}
            {predictionGenerated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Fertility prediction generated successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Fertility Prediction Results */}
            {fertilityPrediction && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-pink-600 mb-6">
                  AI Fertility Prediction Results
                </h2>
                
                {/* AI Model Confidence */}
                <div className={`p-4 rounded-lg mb-4 ${
                  fertilityPrediction.adjustments.confidenceScore >= 0.8 
                    ? 'bg-green-50 border-l-4 border-green-500' 
                    : fertilityPrediction.adjustments.confidenceScore >= 0.6 
                    ? 'bg-yellow-50 border-l-4 border-yellow-500'
                    : 'bg-red-50 border-l-4 border-red-500'
                }`}>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        AI Model Confidence: {Math.round(fertilityPrediction.adjustments.confidenceScore * 100)}% accuracy
                      </h3>
                      <p className="text-sm text-gray-600">
                        Based on multiple data points analyzed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fertile Window */}
                <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-pink-800">
                    Predicted Fertile Window
                  </h3>
                  <p className="text-pink-700">
                    {fertilityPrediction.fertileStart.toLocaleDateString()} - {fertilityPrediction.fertileEnd.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-pink-600">
                    Optimal conception window based on advanced AI analysis
                  </p>
                </div>

                {/* Ovulation Day */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-purple-800">
                    Predicted Ovulation Day
                  </h3>
                  <p className="text-purple-700">
                    {fertilityPrediction.ovulation.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-purple-600">
                    Peak fertility day with highest conception probability
                  </p>
                </div>
              </div>
            )}

            {/* Calendar View */}
            {fertilityPrediction && (
              <FertilityCalendar 
                fertileStart={fertilityPrediction.fertileStart}
                fertileEnd={fertilityPrediction.fertileEnd}
                ovulation={fertilityPrediction.ovulation}
              />
            )}

            {/* AI Health Analytics */}
            <HealthAnalyticsAI 
              userData={userData}
              wearableData={wearableData}
            />

            {/* Personalized Recommendations */}
            <PersonalizedRecommendations 
              userData={userData}
              wearableData={wearableData}
              fertilityPrediction={fertilityPrediction}
            />

          </div>
        </div>
      </div>
      
      {/* Chatbot - Fixed Position Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <FertilityChatbot 
          userData={userData}
          fertilityPrediction={fertilityPrediction}
        />
      </div>
    </div>
  );
};

export default FertilityDashboard;
