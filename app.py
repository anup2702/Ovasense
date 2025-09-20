import streamlit as st
import pandas as pd
import numpy as np
import datetime
import calendar
import google.generativeai as genai  # Google Gemini AI SDK

# Import chatbot functionality
from chatbot import FertilityChatbot, format_user_data_for_chatbot, format_fertile_window_for_chatbot

# Initialize Gemini AI with your API key from Streamlit secrets
try:
    genai.configure(api_key=st.secrets["gemini_api_key"])
    gemini_available = True
except KeyError:
    st.error("❌ Gemini API key not found in Streamlit secrets. Please add 'gemini_api_key' to your secrets.toml file.")
    gemini_available = False
except Exception as e:
    st.error(f"❌ Error configuring Gemini AI: {e}")
    gemini_available = False

# ------------------------------
# Custom Background & Theme Styling
# ------------------------------
page_bg_css = """
<style>
    body {
        background-color: #fff9fb;
        color: #4a4a4a;
    }
    .stApp {
        background-color: #ffffff;
        padding: 1rem;
        color: #333333;
    }
    section[data-testid="stSidebar"] {
        background-color: #ffe6f0;
        color: #ff00ff;
        padding: 2rem 1rem;
    }
    h1, h2, h3, h4, h5, h6 {
        color: #d6336c;
    }
    .stButton>button {
        background-color: #d6336c;
        color: white;
        border-radius: 8px;
        border: none;
        padding: 0.5rem 1rem;
        font-weight: 600;
    }
    .stButton>button:hover {
        background-color: #c92a5c;
        color: white;
    }
    .stTextInput>div>div>input,
    .stNumberInput>div>div>input,
    .stDateInput>div>div>input {
        background-color: white;
        color: #333333;
        border: 1px solid #ccc;
        border-radius: 6px;
    }
    .stFileUploader>div {
        background-color: #fce4ec !important;
        color: #333 !important;
    }
    table.calendar {
        background-color: #ffffff;
        border-collapse: collapse;
        width: 100%;
    }
    table.calendar th {
        background: #fad4e2;
        color: #6a1b4d;
        padding: 10px;
    }
    table.calendar td {
        border: 1px solid #e0e0e0;
        text-align: left;
        vertical-align: top;
        height: 80px;
        padding: 6px;
        font-size: 14px;
        background-color: #fff;
        color: #333;
    }
    .fertile {
        background-color: #ffe0eb !important;
        font-weight: bold;
    }
    .ovulation {
        background-color: #ffc9de !important;
        font-weight: bold;
        color: #b3002d !important;
    }
    .empty {
        background-color: #f5f5f5 !important;
    }
    .stAlert {
        border-radius: 6px;
        padding: 10px;
    }
</style>
"""
st.markdown(page_bg_css, unsafe_allow_html=True)

# ------------------------------
# Title & Intro
# ------------------------------
st.title("🌸 AI-Powered Fertility Tracker")
st.write("Track your cycle, upload wearable data, and get personalized fertility predictions.")

# ------------------------------
# Sidebar - User Inputs
# ------------------------------
st.sidebar.header("📝 Manual Input")

start_date = st.sidebar.date_input("Menstrual Cycle Start Date", datetime.date.today())
cycle_length = st.sidebar.number_input("Average Cycle Length (days)", min_value=20, max_value=40, value=28)

uploaded_file = st.sidebar.file_uploader("📤 Upload Wearable Data (CSV/JSON)", type=["csv", "json"])

# Lifestyle inputs
stress_level = st.sidebar.slider("Stress Level (1 = low, 10 = high)", 1, 10, 5)
hydration = st.sidebar.slider("Daily Water Intake (cups)", 0, 15, 8)
nutrition_quality = st.sidebar.selectbox("Nutrition Quality", ["Poor", "Average", "Good", "Excellent"])

# ------------------------------
# Fertility Prediction Function
# ------------------------------
def predict_fertility(start_date, cycle_length, wearable_df=None):
    start_date = pd.to_datetime(start_date)

    # Basic fertile window estimation
    fertile_window_start = start_date + pd.Timedelta(days=cycle_length - 20)
    fertile_window_end = fertile_window_start + pd.Timedelta(days=6)
    ovulation_day = fertile_window_start + pd.Timedelta(days=3)

    # If wearable data has BBT, use it to adjust ovulation day
    if wearable_df is not None and "BBT" in wearable_df.columns:
        max_bbt_day = wearable_df["BBT"].idxmax()
        ovulation_day = start_date + pd.Timedelta(days=int(max_bbt_day))
        fertile_window_start = ovulation_day - pd.Timedelta(days=3)
        fertile_window_end = ovulation_day + pd.Timedelta(days=2)

    return fertile_window_start, fertile_window_end, ovulation_day

# ------------------------------
# Wearable Data Processing
# ------------------------------
wearable_df = None
if uploaded_file:
    try:
        if uploaded_file.name.endswith(".csv"):
            wearable_df = pd.read_csv(uploaded_file)
        elif uploaded_file.name.endswith(".json"):
            wearable_df = pd.read_json(uploaded_file)
        # Optional: convert date column if present
        if wearable_df is not None and "date" in wearable_df.columns:
            wearable_df["date"] = pd.to_datetime(wearable_df["date"])
    except Exception as e:
        st.sidebar.error(f"Error reading wearable data: {e}")

    if wearable_df is not None:
        st.subheader("📊 Wearable Data Preview")
        st.dataframe(wearable_df.head())

# ------------------------------
# Run Prediction
# ------------------------------
if st.sidebar.button("🔮 Predict Fertile Window"):
    fertile_start, fertile_end, ovulation = predict_fertility(start_date, cycle_length, wearable_df)

    # Styled fertile window box
    st.markdown(f"""
    <div style='
        background-color: #ffe0eb;
        padding: 15px;
        border-left: 6px solid #d6336c;
        border-radius: 6px;
        margin-bottom: 1rem;
        color: #6a1b4d;
        font-weight: 600;
    '>
        🌸 <b>Predicted Fertile Window:</b> {fertile_start.strftime('%d %b')} - {fertile_end.strftime('%d %b')}
    </div>
    """, unsafe_allow_html=True)

    # Styled ovulation day box
    st.markdown(f"""
    <div style='
        background-color: #ffc9de;
        padding: 15px;
        border-left: 6px solid #b3002d;
        border-radius: 6px;
        color: #6a1b4d;
        font-weight: 600;
    '>
        ❤️ <b>Predicted Ovulation Day:</b> {ovulation.strftime('%d %b')}
    </div>
    """, unsafe_allow_html=True)

    # Google Calendar style view
    calendar.setfirstweekday(calendar.SUNDAY)
    year = fertile_start.year
    month = fertile_start.month
    month_days = calendar.monthcalendar(year, month)

    fertile_days = pd.date_range(fertile_start, fertile_end).date
    ovulation_day = ovulation.date()

    html = "<h4 style='margin-top:30px;'>🗓 Fertility Calendar View</h4>"
    html += """
    <style>
        table.calendar { width: 100%; border-collapse: collapse; }
        table.calendar th { background: #eee; padding: 8px; }
        table.calendar td {
            width: 14.28%; height: 80px; vertical-align: top; text-align: left;
            padding: 5px; border: 1px solid #ddd; font-size: 14px;
        }
        .fertile { background-color: #ffe0eb; }
        .ovulation { background-color: #ff9999; color: #b3002d; font-weight: bold; }
        .empty { background-color: #f9f9f9; }
    </style>
    <table class='calendar'>
        <tr>
            <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
        </tr>
    """

    for week in month_days:
        html += "<tr>"
        for day in week:
            if day == 0:
                html += "<td class='empty'></td>"
            else:
                date_obj = datetime.date(year, month, day)
                if date_obj == ovulation_day:
                    html += f"<td class='ovulation'><b>{day}</b><br>❤️ Ovulation</td>"
                elif date_obj in fertile_days:
                    html += f"<td class='fertile'><b>{day}</b><br>🩷 Fertile</td>"
                else:
                    html += f"<td><b>{day}</b></td>"
        html += "</tr>"

    html += "</table>"
    st.markdown(html, unsafe_allow_html=True)

    # Wearable Trends
    if wearable_df is not None:
        st.subheader("📈 Wearable Trends")
        for col in wearable_df.columns:
            if col.lower() != "date":
                st.line_chart(wearable_df[col])

    # Personalized Recommendations
    st.subheader("💡 Personalized Recommendations")

    if wearable_df is not None and "Sleep" in wearable_df.columns:
        avg_sleep = wearable_df["Sleep"].mean()
        if avg_sleep < 6:
            st.warning("⏰ Your average sleep is below 6 hours — aim for 7-9 hours.")
        elif avg_sleep < 7:
            st.info("👍 Sleep is slightly below optimal.")
        else:
            st.success("😴 Great sleep habits!")

    if wearable_df is not None and "Steps" in wearable_df.columns:
        avg_steps = wearable_df["Steps"].mean()
        if avg_steps < 3000:
            st.warning("🚶‍♀️ Low daily activity detected (<3000 steps).")
        elif avg_steps < 7000:
            st.info("🏃‍♀️ Moderate activity level.")
        else:
            st.success("💪 Excellent activity levels!")

    if stress_level >= 8:
        st.warning("😣 High stress levels can affect your cycle. Try relaxation techniques.")
    elif stress_level >= 5:
        st.info("🙂 Moderate stress levels. Manage stress for better health.")
    else:
        st.success("😊 Low stress levels — great!")

    if hydration < 6:
        st.warning("💧 Low water intake. Stay hydrated!")
    elif hydration < 10:
        st.info("👍 Decent hydration, but drink more if possible.")
    else:
        st.success("💧 Excellent hydration!")

    if nutrition_quality == "Poor":
        st.warning("🍎 Poor nutrition. Consider a balanced diet.")
    elif nutrition_quality == "Average":
        st.info("🍎 Average diet — try adding more nutrients.")
    else:
        st.success("🥗 Great nutrition!")

    if (wearable_df is not None and "Sleep" in wearable_df.columns and wearable_df["Sleep"].mean() < 7) and stress_level >= 7:
        st.error("⚠️ Low sleep combined with high stress can affect your cycle. Prioritize rest and stress reduction.")

    # Teleconsultation
    st.subheader("👩‍⚕️ Need Expert Help?")
    st.markdown("[Book a Teleconsultation](https://meet.google.com/)")

else:
    st.info("👉 Enter your cycle details and click **Predict Fertile Window** to get started.")

# ------------------------------
# Gemini AI Integration for Personalized Insights
# ------------------------------
st.sidebar.header("🤖 AI Insights")

if st.sidebar.button("✨ Get AI Insights"):
    with st.spinner("Generating personalized AI insights..."):
        try:
            # Compose prompt for Gemini AI
            prompt = f"""
You are a fertility health assistant. Given the following data, provide personalized fertility and lifestyle insights:

- Menstrual cycle start date: {start_date.strftime('%Y-%m-%d')}
- Average cycle length: {cycle_length} days
- Stress level (1-10): {stress_level}
- Daily hydration (cups): {hydration}
- Nutrition quality: {nutrition_quality}
"""

            if wearable_df is not None:
                wearable_summary = ""
                for col in wearable_df.columns:
                    if col.lower() != "date":
                        avg_val = wearable_df[col].mean()
                        wearable_summary += f"- Average {col}: {avg_val:.2f}\n"
                prompt += "\nWearable data summary:\n" + wearable_summary

            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            ai_text = response.text

            st.subheader("🤖 AI-Generated Personalized Insights")
            st.markdown(ai_text)

        except Exception as e:
            st.error(f"Error generating AI insights: {e}")

# ------------------------------
# Chatbot Integration
# ------------------------------
st.sidebar.header("💬 AI Chatbot")

# Initialize session state for chat
if 'chat_messages' not in st.session_state:
    st.session_state.chat_messages = []
if 'chat_active' not in st.session_state:
    st.session_state.chat_active = False

# Chatbot button
if st.sidebar.button("🤖 Start Chat", type="primary"):
    st.session_state.chat_active = not st.session_state.chat_active

# Chat interface
if st.session_state.chat_active:
    st.markdown("---")
    st.subheader("💬 Fertility Health Assistant")
    st.markdown("Ask me anything about fertility, menstrual health, or wellness!")

    # Display chat history
    chat_container = st.container()
    with chat_container:
        for message in st.session_state.chat_messages:
            if message['role'] == 'user':
                st.markdown(f"**You:** {message['content']}")
            else:
                st.markdown(f"**🤖 Assistant:** {message['content']}")

    # Chat input
    user_input = st.text_input("Type your question here...", key="chat_input")

    col1, col2 = st.columns([1, 1])
    with col1:
        if st.button("Send", key="send_message"):
            if user_input.strip():
                # Add user message to history
                st.session_state.chat_messages.append({
                    'role': 'user',
                    'content': user_input
                })

                # Prepare context for chatbot
                user_data = format_user_data_for_chatbot({
                    'start_date': start_date,
                    'cycle_length': cycle_length,
                    'stress_level': stress_level,
                    'hydration': hydration,
                    'nutrition_quality': nutrition_quality
                })

                fertile_window = None
                if 'fertile_start' in locals():
                    fertile_window = format_fertile_window_for_chatbot(
                        fertile_start, fertile_end, ovulation
                    )

                # Get chatbot response
                chatbot = FertilityChatbot()
                bot_response = chatbot.get_response(
                    user_input,
                    user_data,
                    fertile_window,
                    st.session_state.chat_messages[:-1]  # Exclude the current user message
                )

                # Add bot response to history
                st.session_state.chat_messages.append({
                    'role': 'assistant',
                    'content': bot_response
                })

                # Clear input and rerun
                st.rerun()

    with col2:
        if st.button("Clear Chat", key="clear_chat"):
            st.session_state.chat_messages = []
            st.rerun()

    # Quick action buttons
    st.markdown("**Quick Questions:**")
    col1, col2, col3 = st.columns(3)

    with col1:
        if st.button("Fertility Tips", key="fertility_tips"):
            st.session_state.chat_messages.append({
                'role': 'user',
                'content': 'What are some tips to improve fertility?'
            })
            st.rerun()

    with col2:
        if st.button("Nutrition Advice", key="nutrition_advice"):
            st.session_state.chat_messages.append({
                'role': 'user',
                'content': 'What should I eat to support my fertility?'
            })
            st.rerun()

    with col3:
        if st.button("Stress Management", key="stress_management"):
            st.session_state.chat_messages.append({
                'role': 'user',
                'content': 'How can I manage stress to improve my fertility?'
            })
            st.rerun()

# Add some spacing at the end
st.markdown("<br><br>", unsafe_allow_html=True)
