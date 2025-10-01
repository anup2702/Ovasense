import React, { useState, useRef, useEffect } from 'react';
import { model, generationConfig, safetySettings } from '../config/gemini';

const FertilityChatbot = ({ userData, fertilityPrediction }) => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatUserDataForAI = () => {
    return `
COMPREHENSIVE USER HEALTH PROFILE:

Menstrual Cycle Data:
- Last period start date: ${userData.startDate || 'Not provided'}
- Average cycle length: ${userData.cycleLength || 'Not provided'} days
- Period duration: ${userData.periodDuration || 'Not provided'} days
- Flow intensity: ${userData.flowIntensity || 'Not provided'}

Basal Body Temperature (BBT):
- Current BBT: ${userData.currentBBT || 'Not provided'}°F
- BBT tracking method: ${userData.bbtTracking || 'Not provided'}
- BBT measurement consistency: ${userData.bbtConsistency || 'Not provided'}/10

Lifestyle Habits:
- Stress level (1-10): ${userData.stressLevel || 'Not provided'}
- Daily hydration (cups): ${userData.hydration || 'Not provided'}
- Nutrition quality: ${userData.nutritionQuality || 'Not provided'}
- Average sleep hours: ${userData.sleepHours || 'Not provided'}
- Exercise frequency: ${userData.exerciseFrequency || 'Not provided'}
- Alcohol consumption: ${userData.alcoholConsumption || 'Not provided'}
- Smoking status: ${userData.smokingStatus || 'Not provided'}

Health & Supplements:
- Current supplements: ${userData.supplements?.join(', ') || 'None'}
- Health conditions: ${userData.healthConditions?.join(', ') || 'None'}
- Current medications: ${userData.medications || 'None'}
    `.trim();
  };

  const formatFertilityPrediction = () => {
    if (!fertilityPrediction) return "No fertility predictions available yet.";
    
    return `
Current Fertility Predictions:
- Fertile window: ${fertilityPrediction.fertileStart.toLocaleDateString()} - ${fertilityPrediction.fertileEnd.toLocaleDateString()}
- Predicted ovulation: ${fertilityPrediction.ovulation.toLocaleDateString()}
- AI Confidence: ${Math.round(fertilityPrediction.adjustments.confidenceScore * 100)}%
    `.trim();
  };

  const getConversationContext = () => {
    if (messages.length === 0) return "";
    
    const recentMessages = messages.slice(-6);
    let context = "\nRecent conversation context:\n";
    recentMessages.forEach(msg => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      context += `${role}: ${msg.content}\n`;
    });
    
    return context.trim();
  };

  const generateAIResponse = async (userInput) => {
    try {
      // Check if API key is available
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        return getMockResponse(userInput);
      }

      const systemContext = `
You are a concise fertility health assistant. Provide SHORT, helpful responses (2-3 sentences max).

Guidelines:
- Be direct and to the point
- Use simple, clear language
- Focus on practical advice
- Always recommend consulting healthcare providers for medical concerns
- Keep responses under 50 words when possible

Topics: menstrual cycles, fertility tips, lifestyle factors, general health advice.
      `;

      const prompt = `${systemContext}

${formatUserDataForAI()}

${formatFertilityPrediction()}

${getConversationContext()}

User Question: ${userInput}

Provide a SHORT, direct response (2-3 sentences max):
1. Answer the question directly
2. Give one practical tip if relevant
3. Suggest consulting a doctor for medical concerns

Keep it under 50 words and conversational.
      `;

      // Call Gemini API
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = await result.response;
      return response.text();

    } catch (error) {
      // Fallback to mock response if API call fails
      if (error.message?.includes('API_KEY') || error.message?.includes('quota')) {
        return "Technical difficulties. Please try again later or consult a healthcare professional.";
      }
      
      return getMockResponse(userInput);
    }
  };

  const getMockResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('fertility') || lowerInput.includes('conceive')) {
      return "Focus on healthy lifestyle: good sleep, stress management, and balanced nutrition. Track your cycle consistently. Consult a doctor for personalized guidance.";
    }
    
    if (lowerInput.includes('cycle') || lowerInput.includes('period')) {
      return "Regular cycles range 21-35 days. Track symptoms and patterns. See a doctor if you notice irregularities or changes.";
    }
    
    if (lowerInput.includes('nutrition') || lowerInput.includes('diet') || lowerInput.includes('food')) {
      return "Eat balanced meals with fruits, vegetables, whole grains, and lean proteins. Focus on folate, iron, and omega-3 rich foods. Consider a nutritionist for personalized advice.";
    }
    
    if (lowerInput.includes('stress') || lowerInput.includes('anxiety')) {
      return "Chronic stress affects fertility. Try meditation, yoga, or regular exercise. If stress impacts daily life, consider professional help.";
    }
    
    if (lowerInput.includes('exercise') || lowerInput.includes('workout')) {
      return "Moderate exercise 3-4 times weekly supports fertility. Avoid excessive high-intensity workouts that may affect your cycle.";
    }
    
    if (lowerInput.includes('sleep')) {
      return "Aim for 7-9 hours nightly. Keep consistent sleep schedule and relaxing bedtime routine for hormonal balance.";
    }
    
    if (lowerInput.includes('bbt') || lowerInput.includes('temperature')) {
      return "Measure BBT at same time daily. Track consistently for several cycles to identify ovulation patterns. Consult doctor for interpretation.";
    }
    
    return "I provide general fertility information. For medical advice, please consult a healthcare provider.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, having trouble processing your request. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-pink-600">AI Assistant</h3>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            isActive 
              ? 'bg-red-600  hover:bg-red-700' 
              : 'bg-pink-600  hover:bg-pink-700'
          }`}
        >
          {isActive ? 'Close' : 'Chat'}
        </button>
      </div>

      {isActive && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Ask about fertility, cycles, or wellness. I provide short, helpful answers.
          </p>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                <p className="text-sm">Type a message or use quick questions below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-sm px-3 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-pink-600 text-pink-50'
                          : 'bg-gray-50 text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 text-gray-800 border border-gray-200 px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-pink-600"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Questions:</h4>
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => handleQuickQuestion('Fertility tips?')}
                className="text-left p-2 text-xs bg-pink-50 hover:bg-pink-100 rounded-md transition-colors"
              >
                Fertility Tips
              </button>
              <button
                onClick={() => handleQuickQuestion('What to eat for fertility?')}
                className="text-left p-2 text-xs bg-pink-50 hover:bg-pink-100 rounded-md transition-colors"
              >
                Nutrition Advice
              </button>
              <button
                onClick={() => handleQuickQuestion('How to manage stress?')}
                className="text-left p-2 text-xs bg-pink-50 hover:bg-pink-100 rounded-md transition-colors"
              >
                Stress Management
              </button>
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-3 py-1.5 text-sm bg-pink-600 rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              onClick={clearChat}
              className="px-3 py-1.5 text-sm bg-gray-500  rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded-md">
            <p>
              <strong>Note:</strong> General information only. Consult healthcare providers for medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FertilityChatbot;
