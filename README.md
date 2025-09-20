# 🌸 AI-Powered Fertility Tracker

A comprehensive fertility tracking application with integrated AI chatbot for personalized fertility health assistance.

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
   cd fertility-tracker
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up API keys**
   - Create a `.streamlit/secrets.toml` file
   - Add your Google Gemini API key:
     ```toml
     gemini_api_key = "your-api-key-here"
     ```

4. **Run the application**
   ```bash
   streamlit run app_final.py
   ```

## Usage

### Basic Fertility Tracking

1. **Input your cycle information** in the sidebar:
   - Menstrual cycle start date
   - Average cycle length
   - Upload wearable data (optional)

2. **Get predictions** by clicking "🔮 Predict Fertile Window"

3. **View results**:
   - Fertile window dates
   - Predicted ovulation day
   - Interactive calendar view
   - Personalized recommendations

### AI Chatbot

1. **Start a chat** by clicking "🤖 Start Chat" in the sidebar

2. **Ask questions** about:
   - Fertility tips and advice
   - Menstrual cycle tracking
   - Nutrition for fertility
   - Stress management
   - General reproductive health

3. **Use quick actions** for common questions:
   - Fertility Tips
   - Nutrition Advice
   - Stress Management

### AI Insights

1. **Get personalized insights** by clicking "✨ Get AI Insights"
2. **Review recommendations** based on your lifestyle data
3. **Apply suggestions** to improve your fertility health

## File Structure

```
fertility-tracker/
├── app_final.py          # Main Streamlit application
├── chatbot.py            # AI chatbot implementation
├── requirements.txt      # Python dependencies
├── .streamlit/
│   └── secrets.toml      # API keys and configuration
└── README.md            # This file
```

## Dependencies

- **streamlit**: Web application framework
- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing
- **google-generativeai**: Google Gemini AI integration
- **python-dateutil**: Date parsing and manipulation

## API Configuration

### Google Gemini AI Setup

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `.streamlit/secrets.toml`:
   ```toml
   gemini_api_key = "your-actual-api-key"
   ```

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

- **No Data Storage**: All data is processed locally and not stored
- **Medical Disclaimer**: The app provides general information only
- **Professional Consultation**: Always encourages users to consult healthcare providers
- **Secure API Usage**: Uses secure API key management through Streamlit secrets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## Disclaimer

This application is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

**Remember**: This tool is designed to support fertility awareness and general wellness education. For personalized medical advice, please consult with qualified healthcare professionals.
