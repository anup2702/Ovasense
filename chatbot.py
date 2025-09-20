import google.generativeai as genai
import pandas as pd
import json
from datetime import datetime, timedelta

class FertilityChatbot:
    """
    A comprehensive fertility health chatbot that provides personalized advice
    based on user data, fertility predictions, and conversation history.
    """

    def __init__(self):
        """Initialize the chatbot with context about fertility health."""
        self.system_context = """
You are an empathetic, knowledgeable fertility health assistant. Your role is to:

1. Provide accurate, evidence-based information about fertility and reproductive health
2. Be supportive and non-judgmental in all interactions
3. Encourage users to consult healthcare professionals for medical advice
4. Use clear, accessible language while being medically accurate
5. Focus on lifestyle factors, general wellness, and fertility awareness
6. Always prioritize user safety and well-being

Key topics you can help with:
- Menstrual cycle tracking and understanding
- Fertility awareness and natural family planning
- Lifestyle factors affecting fertility (nutrition, exercise, stress, sleep)
- General reproductive health education
- Emotional support and wellness tips
- When to seek professional medical help

Remember: You are not a substitute for professional medical advice. Always recommend consulting healthcare providers for personalized medical concerns.
"""

    def format_user_data(self, user_data):
        """Format user data for context in AI prompts."""
        formatted = f"""
User Profile:
- Menstrual cycle start date: {user_data.get('start_date', 'Not provided')}
- Average cycle length: {user_data.get('cycle_length', 'Not provided')} days
- Stress level (1-10): {user_data.get('stress_level', 'Not provided')}
- Daily hydration (cups): {user_data.get('hydration', 'Not provided')}
- Nutrition quality: {user_data.get('nutrition_quality', 'Not provided')}
"""
        return formatted.strip()

    def format_fertile_window(self, fertile_start, fertile_end, ovulation):
        """Format fertility prediction data for context."""
        formatted = f"""
Current Fertility Predictions:
- Fertile window: {fertile_start.strftime('%B %d')} - {fertile_end.strftime('%B %d')}
- Predicted ovulation: {ovulation.strftime('%B %d')}
"""
        return formatted.strip()

    def get_conversation_context(self, chat_history):
        """Extract relevant context from recent conversation history."""
        if not chat_history:
            return ""

        # Get last 3 exchanges for context
        recent_messages = chat_history[-6:] if len(chat_history) > 6 else chat_history

        context = "\nRecent conversation context:\n"
        for msg in recent_messages:
            role = "User" if msg['role'] == 'user' else "Assistant"
            context += f"{role}: {msg['content']}\n"

        return context.strip()

    def generate_response(self, user_input, user_data, fertile_window, chat_history):
        """Generate a contextual response using Gemini AI."""
        try:
            # Configure Gemini AI
            genai.configure(api_key="YOUR_API_KEY")  # Replace with actual API key

            # Create comprehensive prompt
            prompt = f"""{self.system_context}

{self.format_user_data(user_data)}

{fertile_window if fertile_window else "No fertility predictions available yet."}

{self.get_conversation_context(chat_history)}

User Question: {user_input}

Please provide a helpful, empathetic response that:
1. Directly addresses the user's question
2. Uses the provided context when relevant
3. Provides practical, actionable advice
4. Encourages professional medical consultation when appropriate
5. Maintains a supportive and positive tone

Response format:
- Start with a brief, empathetic acknowledgment
- Provide clear, practical information
- End with an encouraging note or next step suggestion
- Keep the response conversational and easy to understand
"""

            # Generate response using Gemini AI
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)

            return response.text.strip()

        except Exception as e:
            return self.get_fallback_response(user_input, str(e))

    def get_fallback_response(self, user_input, error=None):
        """Provide fallback responses when AI is unavailable."""
        fallback_responses = {
            "fertility": "I understand you're interested in fertility topics. While I can't provide personalized medical advice, I can share some general information about fertility awareness and lifestyle factors that may support reproductive health. Consider consulting with a healthcare provider for personalized guidance.",
            "cycle": "Menstrual cycle tracking can be very helpful for understanding your body better. General tips include tracking your cycle length, noting any symptoms, and maintaining a healthy lifestyle. A healthcare provider can help you interpret your specific patterns.",
            "nutrition": "Good nutrition plays an important role in overall health. Focus on a balanced diet rich in fruits, vegetables, whole grains, and lean proteins. Staying hydrated and maintaining a healthy weight can support overall wellness.",
            "stress": "Stress management is important for overall health. Consider practices like regular exercise, meditation, adequate sleep, and activities you enjoy. If stress is significantly impacting your life, consider speaking with a healthcare professional.",
            "help": "I'm here to help with general information about fertility awareness and reproductive health. For personalized medical advice, diagnosis, or treatment, please consult with a qualified healthcare provider.",
            "default": "I appreciate you reaching out with your question. While I'm designed to provide general information about fertility and reproductive health, I always recommend consulting with healthcare professionals for personalized advice and concerns."
        }

        # Simple keyword matching for fallback responses
        user_lower = user_input.lower()
        for key, response in fallback_responses.items():
            if key in user_lower:
                return response

        return fallback_responses["default"]

    def get_quick_responses(self):
        """Provide predefined quick response options."""
        return {
            "fertility_tips": "What are some general tips to support fertility?",
            "cycle_tracking": "How can I better track my menstrual cycle?",
            "nutrition": "What foods support reproductive health?",
            "stress_management": "How can I manage stress to support my health?",
            "when_to_seek_help": "When should I see a doctor about fertility concerns?",
            "lifestyle_factors": "What lifestyle factors affect fertility?"
        }

    def validate_input(self, user_input):
        """Basic input validation and sanitization."""
        if not user_input or not isinstance(user_input, str):
            return False, "Please provide a valid question."

        if len(user_input.strip()) < 3:
            return False, "Please provide a more detailed question."

        # Remove potentially harmful content
        dangerous_keywords = ['inject', 'script', 'eval', 'exec']
        if any(keyword in user_input.lower() for keyword in dangerous_keywords):
            return False, "I cannot process that type of request."

        return True, user_input.strip()

    def get_response(self, user_input, user_data=None, fertile_window=None, chat_history=None):
        """
        Main method to get chatbot response.

        Args:
            user_input (str): The user's question or message
            user_data (dict): User's health and cycle data
            fertile_window (dict): Fertility prediction data
            chat_history (list): Previous conversation messages

        Returns:
            str: Chatbot response
        """
        # Validate input
        is_valid, validated_input = self.validate_input(user_input)
        if not is_valid:
            return validated_input

        # Use default values if none provided
        if user_data is None:
            user_data = {}
        if chat_history is None:
            chat_history = []

        try:
            # Try to generate AI response
            response = self.generate_response(validated_input, user_data, fertile_window, chat_history)

            # Add disclaimer for medical topics
            if any(keyword in validated_input.lower() for keyword in
                   ['fertility', 'pregnancy', 'period', 'cycle', 'ovulation', 'symptoms']):
                response += "\n\n*Remember: This is general information only. Please consult with a healthcare provider for personalized medical advice.*"

            return response

        except Exception as e:
            # Fallback to predefined responses
            return self.get_fallback_response(validated_input, str(e))

# Utility functions for data formatting
def format_user_data_for_chatbot(user_data):
    """Format user data for chatbot context."""
    return {
        'start_date': user_data.get('start_date', 'Not provided'),
        'cycle_length': user_data.get('cycle_length', 'Not provided'),
        'stress_level': user_data.get('stress_level', 'Not provided'),
        'hydration': user_data.get('hydration', 'Not provided'),
        'nutrition_quality': user_data.get('nutrition_quality', 'Not provided')
    }

def format_fertile_window_for_chatbot(fertile_start, fertile_end, ovulation):
    """Format fertility prediction data for chatbot context."""
    return {
        'fertile_start': fertile_start.strftime('%Y-%m-%d') if fertile_start else None,
        'fertile_end': fertile_end.strftime('%Y-%m-%d') if fertile_end else None,
        'ovulation': ovulation.strftime('%Y-%m-%d') if ovulation else None
    }

# Example usage and testing
if __name__ == "__main__":
    # Initialize chatbot
    chatbot = FertilityChatbot()

    # Example user data
    sample_user_data = {
        'start_date': '2024-01-15',
        'cycle_length': 28,
        'stress_level': 6,
        'hydration': 8,
        'nutrition_quality': 'Good'
    }

    # Example fertility prediction
    sample_fertile_window = {
        'fertile_start': '2024-01-25',
        'fertile_end': '2024-01-31',
        'ovulation': '2024-01-28'
    }

    # Test conversation
    test_questions = [
        "What are some tips to improve fertility?",
        "How can I track my menstrual cycle better?",
        "What foods should I eat to support my fertility?"
    ]

    for question in test_questions:
        print(f"\nUser: {question}")
        response = chatbot.get_response(question, sample_user_data, sample_fertile_window)
        print(f"Assistant: {response}")
        print("-" * 50)
