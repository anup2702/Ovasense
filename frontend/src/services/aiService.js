import { GoogleGenerativeAI } from '@google/generative-ai';
import { generationConfig, safetySettings } from '../config/gemini';

class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.model = null;
  }

  // Initialize the model dynamically
  getModel() {
    if (!this.model && this.isAIAvailable()) {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
    return this.model;
  }

  // Check if AI is available
  isAIAvailable() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const isAvailable = !!apiKey && apiKey.startsWith('AIza');
    return isAvailable;
  }

  // Generate fertility predictions using AI
  async generateFertilityPrediction(userData, wearableData = null) {
    if (!this.isAIAvailable()) {
      return this.getFallbackPrediction(userData);
    }

    try {
      const prompt = `
You are an expert fertility specialist AI. Analyze the following user data and provide accurate fertility predictions.

USER HEALTH PROFILE:
- Last period start: ${userData.startDate || 'Not provided'}
- Average cycle length: ${userData.cycleLength || 'Not provided'} days
- Period duration: ${userData.periodDuration || 'Not provided'} days
- Flow intensity: ${userData.flowIntensity || 'Not provided'}
- Current BBT: ${userData.currentBBT || 'Not provided'}°F
- BBT tracking method: ${userData.bbtTracking || 'Not provided'}
- BBT consistency: ${userData.bbtConsistency || 'Not provided'}/10
- Stress level: ${userData.stressLevel || 'Not provided'}/10
- Daily hydration: ${userData.hydration || 'Not provided'} cups
- Nutrition quality: ${userData.nutritionQuality || 'Not provided'}
- Sleep hours: ${userData.sleepHours || 'Not provided'}
- Exercise frequency: ${userData.exerciseFrequency || 'Not provided'}
- Alcohol consumption: ${userData.alcoholConsumption || 'Not provided'}
- Smoking status: ${userData.smokingStatus || 'Not provided'}
- Supplements: ${userData.supplements?.join(', ') || 'None'}
- Health conditions: ${userData.healthConditions?.join(', ') || 'None'}
- Medications: ${userData.medications || 'None'}

${wearableData ? `
WEARABLE DATA INSIGHTS:
- Total records: ${wearableData.length}
- Data quality: ${this.calculateDataQuality(wearableData)}%
- Average sleep: ${wearableData.Sleep?.mean()?.toFixed(1) || 'N/A'} hours
- Average steps: ${wearableData.Steps?.mean()?.toFixed(0) || 'N/A'}
- Average heart rate: ${wearableData.Heart_Rate?.mean()?.toFixed(0) || 'N/A'} bpm
- Average BBT: ${wearableData.BBT?.mean()?.toFixed(1) || 'N/A'}°F
` : ''}

Please provide a comprehensive fertility prediction in the following JSON format:
{
  "fertileStart": "YYYY-MM-DD",
  "fertileEnd": "YYYY-MM-DD", 
  "ovulation": "YYYY-MM-DD",
  "confidenceScore": 0.85,
  "insights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ],
  "riskFactors": [
    "Any risk factors identified"
  ],
  "nextSteps": [
    "What the user should do next"
  ]
}

Base your predictions on:
1. Standard cycle calculations (ovulation typically occurs 14 days before next period)
2. BBT patterns if available
3. Lifestyle factors that affect fertility
4. Health conditions and their impact
5. Wearable data patterns if provided

Be medically accurate but remember you are providing general guidance, not medical diagnosis.
      `;

      const model = this.getModel();
      if (!model) {
        return this.getFallbackPrediction(userData);
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = await result.response;
      const aiResponse = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const prediction = JSON.parse(jsonMatch[0]);
          return this.formatPredictionResponse(prediction);
        }
      } catch (parseError) {
      }

      return this.getFallbackPrediction(userData);
    } catch (error) {
      return this.getFallbackPrediction(userData);
    }
  }

  // Generate personalized recommendations using AI
  async generatePersonalizedRecommendations(userData, wearableData = null, fertilityPrediction = null) {
    
    if (!this.isAIAvailable()) {
      return this.getFallbackRecommendations(userData);
    }

    try {
      const prompt = `
You are an expert fertility and wellness AI. Based on the user's health profile, provide personalized recommendations.

USER DATA:
${JSON.stringify(userData, null, 2)}

${wearableData ? `WEARABLE DATA: ${JSON.stringify(wearableData, null, 2)}` : ''}

${fertilityPrediction ? `FERTILITY PREDICTION: ${JSON.stringify(fertilityPrediction, null, 2)}` : ''}

Provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "type": "error|warning|success|info",
      "title": "Short Title",
      "message": "Brief, actionable message",
      "details": ["Key point 1", "Key point 2"],
      "priority": "high|medium|low"
    }
  ],
  "lifestyleTips": [
    {
      "category": "Sleep|Nutrition|Exercise|Stress|Hydration",
      "title": "Quick Tip",
      "description": "Simple, actionable advice",
      "actionable": true
    }
  ],
  "healthOptimization": {
    "immediateActions": ["Quick action 1", "Quick action 2"],
    "longTermGoals": ["Goal 1", "Goal 2"],
    "monitoringSuggestions": ["Suggestion 1", "Suggestion 2"]
  }
}

Keep responses:
- Short and easy to understand
- Actionable and specific
- Evidence-based but concise
- Supportive and encouraging
      `;

      const model = this.getModel();
      if (!model) {
        return this.getFallbackRecommendations(userData);
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = await result.response;
      const aiResponse = response.text();
      
      
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed;
        }
      } catch (parseError) {
      }

      return this.getFallbackRecommendations(userData);
    } catch (error) {
      return this.getFallbackRecommendations(userData);
    }
  }

  // Analyze wearable data using AI
  async analyzeWearableData(wearableData, userData = null) {
    console.log('🤖 AI Service: Analyzing wearable data...');
    console.log('Wearable Data:', wearableData);
    console.log('User Data:', userData);
    
    if (!this.isAIAvailable()) {
      console.log('❌ AI not available for wearable analysis, using fallback');
      return this.getFallbackWearableAnalysis(wearableData);
    }

    try {
      const prompt = `
You are a health data analysis AI. Analyze the following wearable device data and provide insights.

WEARABLE DATA:
${JSON.stringify(wearableData, null, 2)}

${userData ? `USER CONTEXT: ${JSON.stringify(userData, null, 2)}` : ''}

Provide analysis in this JSON format:
{
  "dataQuality": {
    "score": 85,
    "issues": ["Issue 1", "Issue 2"],
    "strengths": ["Strength 1", "Strength 2"]
  },
  "healthInsights": [
    {
      "metric": "Sleep|Steps|Heart_Rate|BBT|Weight",
      "trend": "improving|declining|stable|variable",
      "insight": "What this means for fertility",
      "recommendation": "What to do about it"
    }
  ],
  "fertilityCorrelations": [
    {
      "pattern": "Description of pattern",
      "impact": "How it affects fertility",
      "action": "Recommended action"
    }
  ],
  "anomalies": [
    {
      "date": "YYYY-MM-DD",
      "metric": "Metric name",
      "value": "Unusual value",
      "explanation": "Possible explanation"
    }
  ],
  "optimizationSuggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}

Keep responses:
- Short and actionable
- Easy to understand
- Focus on key insights
      `;

      const model = this.getModel();
      if (!model) {
        return this.getFallbackWearableAnalysis(wearableData);
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = await result.response;
      const aiResponse = response.text();
      
      
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed;
        }
      } catch (parseError) {
      }

      return this.getFallbackWearableAnalysis(wearableData);
    } catch (error) {
      return this.getFallbackWearableAnalysis(wearableData);
    }
  }

  // Generate health analytics using AI
  async generateHealthAnalytics(userData, wearableData = null) {
    if (!this.isAIAvailable()) {
      return this.getFallbackHealthAnalytics(userData);
    }

    try {
      const prompt = `
You are a comprehensive health analytics AI. Analyze the user's health data and provide detailed insights.

USER DATA:
${JSON.stringify(userData, null, 2)}

${wearableData ? `WEARABLE DATA: ${JSON.stringify(wearableData, null, 2)}` : ''}

Provide analytics in this JSON format:
{
  "overallHealthScore": 78,
  "fertilityHealthScore": 82,
  "riskAssessment": {
    "high": ["Risk 1", "Risk 2"],
    "medium": ["Risk 3"],
    "low": ["Risk 4"]
  },
  "strengths": [
    "Health strength 1",
    "Health strength 2"
  ],
  "areasForImprovement": [
    {
      "area": "Sleep|Nutrition|Exercise|Stress|Hydration",
      "currentStatus": "Current status",
      "target": "Target goal",
      "actionPlan": ["Action 1", "Action 2"]
    }
  ],
  "trends": [
    {
      "metric": "Metric name",
      "trend": "improving|declining|stable",
      "timeframe": "Last 30 days",
      "significance": "Why this matters for fertility"
    }
  ],
  "predictions": [
    {
      "metric": "Metric name",
      "prediction": "What to expect",
      "confidence": 0.85,
      "timeframe": "Next 30 days"
    }
  ]
}

Focus on:
1. Overall health and fertility correlation
2. Risk factor identification
3. Trend analysis
4. Predictive insights
5. Actionable improvement areas
      `;

      const model = this.getModel();
      if (!model) {
        return this.getFallbackHealthAnalytics(userData);
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = await result.response;
      const aiResponse = response.text();
      
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
      }

      return this.getFallbackHealthAnalytics(userData);
    } catch (error) {
      return this.getFallbackHealthAnalytics(userData);
    }
  }

  // Helper methods for fallback responses
  formatPredictionResponse(prediction) {
    return {
      fertileStart: new Date(prediction.fertileStart),
      fertileEnd: new Date(prediction.fertileEnd),
      ovulation: new Date(prediction.ovulation),
      adjustments: {
        confidenceScore: prediction.confidenceScore || 0.7,
        insights: prediction.insights || [],
        recommendations: prediction.recommendations || [],
        riskFactors: prediction.riskFactors || [],
        nextSteps: prediction.nextSteps || []
      }
    };
  }

  calculateDataQuality(wearableData) {
    if (!wearableData || !wearableData.raw) return 0;
    
    const totalCells = wearableData.length * wearableData.columns.length;
    const missingCells = wearableData.raw.reduce((count, row) => {
      return count + Object.values(row).filter(value => !value || value === '').length;
    }, 0);
    
    return Math.round(((totalCells - missingCells) / totalCells) * 100);
  }

  // Fallback methods when AI is not available
  getFallbackPrediction(userData) {
    const startDate = new Date(userData.startDate);
    const cycleLength = userData.cycleLength || 28;
    
    const fertileWindowStart = new Date(startDate);
    fertileWindowStart.setDate(fertileWindowStart.getDate() + cycleLength - 20);
    
    const fertileWindowEnd = new Date(fertileWindowStart);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 6);
    
    const ovulationDay = new Date(fertileWindowStart);
    ovulationDay.setDate(ovulationDay.getDate() + 3);

    return {
      fertileStart: fertileWindowStart,
      fertileEnd: fertileWindowEnd,
      ovulation: ovulationDay,
      adjustments: {
        confidenceScore: 0.6,
        insights: ['Basic cycle prediction based on average cycle length'],
        recommendations: ['Consider tracking BBT for more accurate predictions'],
        riskFactors: [],
        nextSteps: ['Continue tracking your cycle data']
      }
    };
  }

  getFallbackRecommendations(userData) {
    return {
      recommendations: [
        {
          type: 'info',
          title: 'AI Recommendations Unavailable',
          message: 'Please set up your Gemini API key for personalized AI recommendations.',
          details: ['Check the setup guide for API key configuration'],
          priority: 'medium'
        }
      ],
      lifestyleTips: [],
      healthOptimization: {
        immediateActions: ['Set up AI API key'],
        longTermGoals: ['Get personalized AI insights'],
        monitoringSuggestions: ['Track your health data consistently']
      }
    };
  }

  getFallbackWearableAnalysis(wearableData) {
    return {
      dataQuality: {
        score: this.calculateDataQuality(wearableData),
        issues: ['AI analysis unavailable - check API key'],
        strengths: ['Data uploaded successfully']
      },
      healthInsights: [],
      fertilityCorrelations: [],
      anomalies: [],
      optimizationSuggestions: ['Set up AI API key for detailed analysis']
    };
  }

  getFallbackHealthAnalytics(userData) {
    return {
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
    };
  }
}

export default new AIService();
