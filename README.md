# 🌸 OvaSense - AI-Powered Fertility Tracker

A comprehensive fertility tracking application built with React and Vite, featuring integrated AI chatbot for personalized fertility health assistance.

## Features

### 📊 Fertility Tracking
- **Cycle Prediction**: Predict fertile windows and ovulation dates based on cycle data
- **Wearable Data Integration**: Upload CSV/JSON files from fitness trackers
- **Visual Calendar**: Interactive calendar view of fertility predictions
- **Personalized Recommendations**: AI-generated insights based on your data

### 💬 AI Chatbot
- **Fertility Health Assistant**: Ask questions about fertility, menstrual health, and wellness
- **Contextual Responses**: Chatbot uses your fertility data for personalized advice
- **Quick Actions**: Predefined questions for common fertility topics
- **Conversation History**: Maintains chat history during your session

### 🤖 AI Insights
- **Gemini AI Integration**: Get personalized insights from Google Gemini AI
- **Lifestyle Analysis**: Recommendations based on stress, nutrition, and activity levels
- **Medical Disclaimer**: Always encourages professional medical consultation

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ovasense
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up API keys**
   - Create a `.env` file in the frontend directory
   - Add your Google Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your-api-key-here
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Usage

### Basic Fertility Tracking

1. **Navigate to the Fertility Dashboard** from the home page
2. **Input your cycle information** in the sidebar:
   - Menstrual cycle start date
   - Average cycle length
   - Lifestyle factors (sleep, stress, nutrition)
   - Upload wearable data (optional)

3. **Get predictions** by clicking "Predict Fertile Window (Advanced AI Model)"

4. **View results**:
   - Fertile window dates
   - Predicted ovulation day
   - Interactive calendar view
   - AI-powered health analytics

### AI-Powered Features

1. **Health Analytics**: Click "Start AI Analysis" to get comprehensive health insights
2. **Personalized Recommendations**: Click "Generate Recommendations" for tailored advice
3. **Wearable Data Analysis**: Upload CSV/JSON files and click "Analyze with AI" for insights

### AI Chatbot

1. **Access the chatbot** from the floating chat button in the bottom-right corner
2. **Ask questions** about:
   - Fertility tips and advice
   - Menstrual cycle tracking
   - Nutrition for fertility
   - Stress management
   - General reproductive health

3. **Get contextual responses** based on your fertility data and health information

## File Structure

```
Ovasense/
├── frontend/                    # React frontend application
│   ├── public/                 # Static assets
│   │   ├── logo.png           # Application logo
│   │   └── vite.svg           # Vite logo
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   │   ├── FertilityCalendar.jsx
│   │   │   ├── FertilityChatbot.jsx
│   │   │   ├── HealthAnalyticsAI.jsx
│   │   │   ├── PersonalizedRecommendations.jsx
│   │   │   ├── WearableDataUpload.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── FertilityDashboard.jsx
│   │   │   └── ...
│   │   ├── services/          # API services
│   │   │   └── aiService.js   # AI service integration
│   │   ├── config/            # Configuration files
│   │   │   └── gemini.js      # Gemini AI configuration
│   │   ├── contexts/          # React contexts
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Node.js dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── eslint.config.js       # ESLint configuration
│   └── index.html             # HTML template
├── sample_wearable_data.csv   # Sample data file
└── README.md                  # This file
```

## Dependencies

### Core Framework
- **React**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing for React applications

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **@tailwindcss/vite**: Vite plugin for Tailwind CSS integration

### AI Integration
- **@google/generative-ai**: Google Gemini AI SDK for JavaScript

### Development Tools
- **ESLint**: JavaScript linting and code quality
- **@vitejs/plugin-react**: Vite plugin for React support
- **TypeScript types**: Type definitions for React and React DOM

## API Configuration

### Google Gemini AI Setup

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the `frontend` directory
3. Add your API key to the `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your-actual-api-key
   ```
4. Restart the development server after adding the API key

## Features in Detail

### Fertility Predictions
- **Algorithm**: Uses standard fertility awareness method calculations
- **Wearable Integration**: Incorporates BBT (Basal Body Temperature) data when available
- **Calendar View**: Visual representation of fertile and ovulation days

### Chatbot Capabilities
- **Context Awareness**: Uses your fertility data for personalized responses
- **Fallback System**: Provides helpful responses even when AI is unavailable
- **Safety Features**: Includes input validation and medical disclaimers
- **Conversation Memory**: Maintains context throughout the session

### AI Insights
- **Personalized Analysis**: Considers your stress level, nutrition, and activity data
- **Actionable Recommendations**: Provides specific, practical advice
- **Professional Guidance**: Always recommends consulting healthcare providers

## Privacy & Safety

- **Local Data Processing**: All user data is processed locally in the browser
- **No Server Storage**: No personal health data is stored on external servers
- **Medical Disclaimer**: The app provides general information only
- **Professional Consultation**: Always encourages users to consult healthcare providers
- **Secure API Usage**: Uses environment variables for secure API key management
- **Client-Side Only**: All calculations and data processing happen in the user's browser

## 🏆 Hackathon

This project was built during **[Hackathon Name]** - a [duration] hackathon focused on [theme/purpose]. 

### 🎯 Challenge
The challenge was to create innovative solutions for women's health and fertility tracking using modern AI technologies. Our team aimed to build a comprehensive fertility tracking application that combines traditional cycle tracking with AI-powered insights and personalized recommendations.

### 🚀 Innovation
- **AI-Powered Insights**: Integrated Google Gemini AI for personalized fertility recommendations
- **Wearable Data Integration**: Support for CSV/JSON data from fitness trackers and health apps
- **Interactive Chatbot**: Context-aware fertility assistant for real-time health guidance
- **Modern UI/UX**: Built with React, Vite, and Tailwind CSS for a beautiful, responsive experience
- **Client-Side Processing**: All calculations and data processing happen locally for privacy
- **Component-Based Architecture**: Modular React components for maintainable code

### 🏅 Achievement
[Add any awards, recognition, or achievements from the hackathon]

## 👥 Contributors

### Core Team

**Alex Johnson** - *Full Stack Developer & AI Integration*
- Led the AI chatbot development and Gemini API integration
- Implemented the fertility prediction algorithms and AI services
- Designed the React component architecture and state management
- 🔗 [GitHub](https://github.com/alexjohnson) | [LinkedIn](https://linkedin.com/in/alexjohnson)

**Sarah Chen** - *Frontend Developer & UI/UX Designer*
- Built the React frontend with Vite and modern component architecture
- Designed the responsive UI with Tailwind CSS
- Implemented the interactive calendar, data visualization, and user experience components
- 🔗 [GitHub](https://github.com/sarahchen) | [LinkedIn](https://linkedin.com/in/sarahchen)


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Contact the development team

## Disclaimer

This application is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

**Remember**: This tool is designed to support fertility awareness and general wellness education. For personalized medical advice, please consult with qualified healthcare professionals.
