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
    body { background-color: #fff9fb; color: #2c2c2c; }
    .stApp { background-color: #ffffff; padding: 1rem; color: #2c2c2c; }
    section[data-testid="stSidebar"] { background-color: #ffe6f0; color: #2c2c2c !important; padding: 2rem 1rem; }

    h1,h2,h3,h4,h5,h6 { color: #d6336c; }

    .stButton>button {
        background-color: #d6336c; color: white; border-radius: 8px; border: none; padding: 0.5rem 1rem; font-weight: 600;
    }
    .stButton>button:hover { background-color: #c92a5c; color: white; }

    .stTextInput>div>div>input,
    .stNumberInput>div>div>input,
    .stDateInput>div>div>input {
        background-color: #fff !important; color: #2c2c2c !important; border: 1px solid #ccc; border-radius: 6px;
    }

    .stFileUploader>div { background-color: #fce4ec !important; color: #2c2c2c !important; }
    .stSelectbox>div>div { background-color: #fff !important; color: #2c2c2c !important; }

    label, .stSliderLabel { color: #2c2c2c !important; }

    table.calendar { background-color: #fff; border-collapse: collapse; width: 100%; }
    table.calendar th { background: #fad4e2; color: #6a1b4d; padding: 10px; }
    table.calendar td { border: 1px solid #e0e0e0; text-align: left; vertical-align: top; height: 80px; padding: 6px; font-size: 14px; background-color: #fff; color: #2c2c2c; }
    .fertile { background-color: #ffe0eb !important; font-weight: bold; color: #2c2c2c !important; }
    .ovulation { background-color: #ffc9de !important; font-weight: bold; color: #b3002d !important; }
    .empty { background-color: #f5f5f5 !important; color: #2c2c2c !important; }
    .stAlert { border-radius: 6px; padding: 10px; }

    section[data-testid="stSidebar"] label,
    section[data-testid="stSidebar"] .stTextInput label,
    section[data-testid="stSidebar"] .stNumberInput label,
    section[data-testid="stSidebar"] .stDateInput label,
    section[data-testid="stSidebar"] .stSlider label,
    section[data-testid="stSidebar"] .stSelectbox label {
        color: #880044 !important; font-weight: 500; font-size: 14px;
    }

    /* Ensure all text elements are visible */
    .stMarkdown, .stMarkdown p, .stMarkdown div, .stMarkdown span {
        color: #2c2c2c !important;
    }
    
    .stMetric, .stMetric > div {
        color: #2c2c2c !important;
    }
    
    .stDataFrame, .stDataFrame table {
        color: #2c2c2c !important;
    }
    
    .stText, .stText p {
        color: #2c2c2c !important;
    }
    
    /* Fix for any hidden text */
    * {
        color: inherit;
    }
    
    /* Ensure sidebar text is visible */
    section[data-testid="stSidebar"] * {
        color: #2c2c2c !important;
    }
    
    section[data-testid="stSidebar"] h1,
    section[data-testid="stSidebar"] h2,
    section[data-testid="stSidebar"] h3,
    section[data-testid="stSidebar"] h4,
    section[data-testid="stSidebar"] h5,
    section[data-testid="stSidebar"] h6 {
        color: #d6336c !important;
    }
</style>
"""
st.markdown(page_bg_css, unsafe_allow_html=True)

# ------------------------------
# Title & Intro
# ------------------------------
st.title("AI-Powered Fertility Tracker")
st.write("Track your cycle, upload wearable data, and get personalized fertility predictions.")

# ------------------------------
# Sidebar - Enhanced Data Collection
# ------------------------------
st.sidebar.header("Comprehensive Health Data Collection")

# Menstrual Cycle Data
st.sidebar.subheader("Menstrual Cycle Data")
start_date = st.sidebar.date_input("Last Period Start Date", datetime.date.today())
cycle_length = st.sidebar.number_input("Average Cycle Length (days)", min_value=20, max_value=40, value=28)
period_duration = st.sidebar.number_input("Period Duration (days)", min_value=2, max_value=10, value=5)
flow_intensity = st.sidebar.selectbox("Flow Intensity", ["Light", "Normal", "Heavy", "Very Heavy"])

# Basal Body Temperature (BBT) Data
st.sidebar.subheader("Basal Body Temperature")
current_bbt = st.sidebar.number_input("Current BBT (°F)", min_value=96.0, max_value=100.0, value=97.5, step=0.1)
bbt_tracking = st.sidebar.selectbox("BBT Tracking Method", ["Oral", "Vaginal", "Rectal", "Not Tracking"])
bbt_consistency = st.sidebar.slider("BBT Measurement Consistency (1-10)", 1, 10, 7)

# Lifestyle Habits
st.sidebar.subheader("Lifestyle Habits")
stress_level = st.sidebar.slider("Stress Level (1 = low, 10 = high)", 1, 10, 5)
hydration = st.sidebar.slider("Daily Water Intake (cups)", 0, 15, 8)
nutrition_quality = st.sidebar.selectbox("Nutrition Quality", ["Poor", "Average", "Good", "Excellent"])
sleep_hours = st.sidebar.slider("Average Sleep Hours", 4, 12, 8)
exercise_frequency = st.sidebar.selectbox("Exercise Frequency", ["None", "1-2 times/week", "3-4 times/week", "5+ times/week"])
alcohol_consumption = st.sidebar.selectbox("Alcohol Consumption", ["None", "Occasional", "Moderate", "Frequent"])
smoking_status = st.sidebar.selectbox("Smoking Status", ["Non-smoker", "Former smoker", "Current smoker"])

# Additional Health Metrics
st.sidebar.subheader("Health & Supplements")
supplements = st.sidebar.multiselect("Current Supplements", 
    ["Folic Acid", "Prenatal Vitamins", "Iron", "Vitamin D", "Omega-3", "Probiotics", "Other"])
medications = st.sidebar.text_area("Current Medications", placeholder="List any medications you're taking...")
health_conditions = st.sidebar.multiselect("Health Conditions", 
    ["PCOS", "Endometriosis", "Thyroid Issues", "Diabetes", "High Blood Pressure", "Other"])

# Data Upload
st.sidebar.subheader("Data Upload")
uploaded_file = st.sidebar.file_uploader("Upload Wearable Data (CSV/JSON)", type=["csv", "json"], 
    help="Upload data from fitness trackers, smartwatches, or health apps")

# ------------------------------
# Enhanced Fertility Prediction Function
# ------------------------------
def predict_fertility_advanced(start_date, cycle_length, period_duration, flow_intensity, 
                              current_bbt, bbt_tracking, bbt_consistency, stress_level, 
                              sleep_hours, exercise_frequency, health_conditions, wearable_df=None):
    """
    Advanced fertility prediction using multiple data points for higher accuracy.
    """
    start_date = pd.to_datetime(start_date)
    
    # Base calculation using cycle length
    fertile_window_start = start_date + pd.Timedelta(days=cycle_length - 20)
    fertile_window_end = fertile_window_start + pd.Timedelta(days=6)
    ovulation_day = fertile_window_start + pd.Timedelta(days=3)

    # Adjustments based on additional data
    adjustments = {
        'ovulation_shift': 0,
        'fertile_window_extension': 0,
        'confidence_score': 0.7
    }
    
    # BBT-based adjustments
    if bbt_tracking != "Not Tracking" and current_bbt > 0:
        # BBT typically rises 0.5-1.0°F after ovulation
        if current_bbt > 98.0:  # Likely post-ovulation
            adjustments['ovulation_shift'] = -2  # Ovulation likely 2 days ago
            adjustments['confidence_score'] += 0.1
        elif current_bbt < 97.0:  # Likely pre-ovulation
            adjustments['ovulation_shift'] = 2  # Ovulation likely 2 days later
            adjustments['confidence_score'] += 0.1
        
        # BBT consistency affects confidence
        if bbt_consistency >= 8:
            adjustments['confidence_score'] += 0.15
        elif bbt_consistency >= 6:
            adjustments['confidence_score'] += 0.1
    
    # Lifestyle factor adjustments
    if stress_level >= 8:
        adjustments['ovulation_shift'] += 1  # Stress can delay ovulation
        adjustments['confidence_score'] -= 0.1
    elif stress_level <= 3:
        adjustments['confidence_score'] += 0.05
    
    if sleep_hours < 6:
        adjustments['ovulation_shift'] += 1  # Poor sleep can affect cycle
        adjustments['confidence_score'] -= 0.05
    elif sleep_hours >= 8:
        adjustments['confidence_score'] += 0.05
    
    # Exercise frequency adjustments
    if exercise_frequency == "5+ times/week":
        adjustments['confidence_score'] += 0.05
    elif exercise_frequency == "None":
        adjustments['confidence_score'] -= 0.05
    
    # Health conditions adjustments
    if "PCOS" in health_conditions:
        adjustments['ovulation_shift'] += 2  # PCOS can cause irregular ovulation
        adjustments['fertile_window_extension'] += 2
        adjustments['confidence_score'] -= 0.2
    if "Thyroid Issues" in health_conditions:
        adjustments['ovulation_shift'] += 1
        adjustments['confidence_score'] -= 0.1
    
    # Flow intensity adjustments
    if flow_intensity == "Heavy" or flow_intensity == "Very Heavy":
        adjustments['confidence_score'] += 0.05  # Stronger period indicates better hormonal function
    
    # Apply adjustments
    ovulation_day += pd.Timedelta(days=adjustments['ovulation_shift'])
    fertile_window_start = ovulation_day - pd.Timedelta(days=3)
    fertile_window_end = ovulation_day + pd.Timedelta(days=2 + adjustments['fertile_window_extension'])
    
    # Wearable data integration (if available)
    if wearable_df is not None and "BBT" in wearable_df.columns:
        # Use wearable BBT data for more accurate prediction
        max_bbt_day = wearable_df["BBT"].idxmax()
        wearable_ovulation = start_date + pd.Timedelta(days=int(max_bbt_day))
        
        # Weight the wearable data more heavily if it's consistent
        if len(wearable_df) >= 7:  # At least a week of data
            # Convert timestamps to days since start_date for averaging
            ovulation_days_since_start = (ovulation_day - start_date).days
            wearable_days_since_start = (wearable_ovulation - start_date).days
            avg_days_since_start = (ovulation_days_since_start + wearable_days_since_start) / 2
            ovulation_day = start_date + pd.Timedelta(days=avg_days_since_start)
            adjustments['confidence_score'] += 0.2
        fertile_window_start = ovulation_day - pd.Timedelta(days=3)
        fertile_window_end = ovulation_day + pd.Timedelta(days=2)

    # Ensure confidence score is within bounds
    adjustments['confidence_score'] = max(0.3, min(0.95, adjustments['confidence_score']))
    
    return fertile_window_start, fertile_window_end, ovulation_day, adjustments

# Legacy function for backward compatibility
def predict_fertility(start_date, cycle_length, wearable_df=None):
    return predict_fertility_advanced(start_date, cycle_length, 5, "Normal", 
                                    97.5, "Not Tracking", 5, 5, 8, "None", [], wearable_df)[:3]

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
        if wearable_df is not None and "date" in wearable_df.columns:
            wearable_df["date"] = pd.to_datetime(wearable_df["date"])
    except Exception as e:
        st.sidebar.error(f"Error reading wearable data: {e}")

    if wearable_df is not None:
        st.subheader("Wearable Data Preview")
        st.dataframe(wearable_df.head())
        
        # Data Quality Analysis
        st.subheader("Data Quality Analysis")
        
        # Check for missing values
        missing_data = wearable_df.isnull().sum()
        if missing_data.sum() > 0:
            st.warning("Missing data detected in your wearable data:")
            for col, missing_count in missing_data.items():
                if missing_count > 0:
                    st.write(f"- {col}: {missing_count} missing values")
        else:
            st.success("No missing data detected in your wearable data!")
        
        # Data completeness score
        completeness_score = (1 - missing_data.sum() / (len(wearable_df) * len(wearable_df.columns))) * 100
        st.metric("Data Completeness", f"{completeness_score:.1f}%")
        
        # Data range validation
        st.subheader("Data Range Validation")
        for col in wearable_df.select_dtypes(include=[np.number]).columns:
            if col.lower() != 'date':
                min_val, max_val = wearable_df[col].min(), wearable_df[col].max()
                st.write(f"**{col}**: {min_val:.2f} - {max_val:.2f}")
                
                # Flag potential outliers
                if col.lower() == 'bbt' and (min_val < 96 or max_val > 100):
                    st.warning(f"BBT values outside normal range (96-100°F)")
                elif col.lower() == 'sleep' and (min_val < 3 or max_val > 12):
                    st.warning(f"Sleep values outside normal range (3-12 hours)")
                elif col.lower() == 'steps' and max_val > 50000:
                    st.info(f"Very high step count detected - verify data accuracy")

# ------------------------------
# Run Enhanced Prediction
# ------------------------------
fertile_start, fertile_end, ovulation, adjustments = None, None, None, None
if st.sidebar.button("Predict Fertile Window (Advanced AI Model)"):
    fertile_start, fertile_end, ovulation, adjustments = predict_fertility_advanced(
        start_date, cycle_length, period_duration, flow_intensity, 
        current_bbt, bbt_tracking, bbt_consistency, stress_level, 
        sleep_hours, exercise_frequency, health_conditions, wearable_df
    )

    # AI Model Confidence Score
    confidence_percentage = int(adjustments['confidence_score'] * 100)
    confidence_color = "#22c55e" if confidence_percentage >= 80 else "#f59e0b" if confidence_percentage >= 60 else "#ef4444"
    
    st.markdown(f"""
    <div style='
        background-color: #f0f9ff;
        padding: 15px;
        border-left: 6px solid {confidence_color};
        border-radius: 6px;
        margin-bottom: 1rem;
        color: #1e40af;
        font-weight: 600;
    '>
        <b>AI Model Confidence:</b> {confidence_percentage}% accuracy
        <br><small>Based on {len([x for x in [bbt_tracking, stress_level, sleep_hours, exercise_frequency, health_conditions] if x and x != "Not Tracking" and x != "None" and x != []])} data points analyzed</small>
    </div>
    """, unsafe_allow_html=True)

    # Fertile window box
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
        <b>Predicted Fertile Window:</b> {fertile_start.strftime('%d %b')} - {fertile_end.strftime('%d %b')}
        <br><small>Optimal conception window based on advanced AI analysis</small>
    </div>
    """, unsafe_allow_html=True)

    # Ovulation day box
    st.markdown(f"""
    <div style='
        background-color: #ffc9de;
        padding: 15px;
        border-left: 6px solid #b3002d;
        border-radius: 6px;
        color: #6a1b4d;
        font-weight: 600;
    '>
        <b>Predicted Ovulation Day:</b> {ovulation.strftime('%d %b')}
        <br><small>Peak fertility day with highest conception probability</small>
    </div>
    """, unsafe_allow_html=True)

    # Calendar view
    calendar.setfirstweekday(calendar.SUNDAY)
    year = fertile_start.year
    month = fertile_start.month
    month_days = calendar.monthcalendar(year, month)
    fertile_days = pd.date_range(fertile_start, fertile_end).date
    ovulation_day = ovulation.date()

    html = "<h4 style='margin-top:30px;'>Fertility Calendar View</h4>"
    html += "<table class='calendar'><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>"
    for week in month_days:
        html += "<tr>"
        for day in week:
            if day == 0:
                html += "<td class='empty'></td>"
            else:
                date_obj = datetime.date(year, month, day)
                if fertile_start and date_obj == ovulation_day:
                    html += f"<td class='ovulation'><b>{day}</b><br>❤️ Ovulation</td>"
                elif fertile_start and date_obj in fertile_days:
                    html += f"<td class='fertile'><b>{day}</b><br>🩷 Fertile</td>"
                else:
                    html += f"<td><b>{day}</b></td>"
        html += "</tr>"
    html += "</table>"
    st.markdown(html, unsafe_allow_html=True)

    # Wearable Trends
    if wearable_df is not None:
        st.subheader("Wearable Trends")
        for col in wearable_df.columns:
            if col.lower() != "date":
                st.line_chart(wearable_df[col])

    # Enhanced Personalized Recommendations
    st.subheader("AI-Powered Personalized Recommendations")
    
    # Sleep recommendations
    if sleep_hours < 6:
        st.error("**Critical**: Sleep deprivation detected! Aim for 7-9 hours nightly for optimal reproductive health.")
    elif sleep_hours < 7:
        st.warning("**Sleep Optimization**: Consider increasing sleep to 7-9 hours for better cycle regulation.")
    elif sleep_hours >= 8:
        st.success("**Excellent Sleep**: Your sleep habits support healthy hormone production!")
    
    # Stress management
    if stress_level >= 8:
        st.error("**High Stress Alert**: Chronic stress can significantly impact fertility. Consider:")
        st.markdown("- Daily meditation or mindfulness practice")
        st.markdown("- Regular exercise (yoga, walking)")
        st.markdown("- Professional counseling if needed")
    elif stress_level >= 5:
        st.warning("**Moderate Stress**: Consider stress-reduction techniques:")
        st.markdown("- Deep breathing exercises")
        st.markdown("- Regular physical activity")
        st.markdown("- Adequate sleep and relaxation")
    else:
        st.success("**Low Stress**: Great stress management! This supports healthy reproductive function.")
    
    # Exercise recommendations
    if exercise_frequency == "None":
        st.warning("**Exercise Needed**: Regular moderate exercise improves fertility. Start with:")
        st.markdown("- 30 minutes of walking, 3-4 times per week")
        st.markdown("- Yoga or gentle stretching")
        st.markdown("- Gradually increase intensity")
    elif exercise_frequency == "5+ times/week":
        st.info("**Exercise Balance**: High-intensity exercise can sometimes affect cycles. Monitor your body's response.")
    else:
        st.success("**Good Exercise**: Regular physical activity supports reproductive health!")
    
    # Nutrition recommendations
    if nutrition_quality == "Poor":
        st.error("**Nutrition Priority**: Focus on fertility-supporting foods:")
        st.markdown("- Leafy greens (folate)")
        st.markdown("- Lean proteins")
        st.markdown("- Whole grains")
        st.markdown("- Reduce processed foods")
    elif nutrition_quality == "Average":
        st.warning("**Nutrition Enhancement**: Add more fertility-boosting foods:")
        st.markdown("- Omega-3 rich fish")
        st.markdown("- Colorful fruits and vegetables")
        st.markdown("- Nuts and seeds")
    else:
        st.success("**Excellent Nutrition**: Your diet supports reproductive health!")
    
    # Hydration
    if hydration < 6:
        st.warning("**Hydration**: Increase water intake to 8-10 cups daily for optimal health.")
    elif hydration >= 10:
        st.success("**Great Hydration**: Excellent water intake supports overall health!")
    
    # BBT tracking recommendations
    if bbt_tracking == "Not Tracking":
        st.info("**BBT Tracking**: Consider tracking basal body temperature for more accurate predictions:")
        st.markdown("- Measure at the same time daily")
        st.markdown("- Use a digital thermometer")
        st.markdown("- Track for 2-3 cycles for patterns")
    elif bbt_consistency < 6:
        st.warning("**BBT Consistency**: Improve measurement consistency for better predictions.")
    else:
        st.success("**BBT Tracking**: Excellent temperature tracking for accurate predictions!")
    
    # Health conditions specific recommendations
    if "PCOS" in health_conditions:
        st.info("**PCOS Management**: Work with your healthcare provider on:")
        st.markdown("- Blood sugar regulation")
        st.markdown("- Weight management if needed")
        st.markdown("- Regular monitoring")
    
    if "Thyroid Issues" in health_conditions:
        st.info("**Thyroid Health**: Ensure proper thyroid management:")
        st.markdown("- Regular TSH monitoring")
        st.markdown("- Medication compliance")
        st.markdown("- Iodine-rich foods")
    
    # Supplement recommendations
    if not supplements:
        st.info("**Supplements**: Consider fertility-supporting supplements:")
        st.markdown("- Folic acid (400-800 mcg daily)")
        st.markdown("- Prenatal vitamins")
        st.markdown("- Vitamin D if deficient")
    else:
        st.success("**Supplements**: Good supplement routine! Continue as recommended by your healthcare provider.")
    
    # Lifestyle factors
    if alcohol_consumption == "Frequent":
        st.warning("**Alcohol**: Consider reducing alcohol intake for optimal fertility.")
    elif smoking_status == "Current smoker":
        st.error("**Smoking**: Quitting smoking significantly improves fertility outcomes.")
    
    # Combined risk factors
    risk_factors = []
    if sleep_hours < 6: risk_factors.append("sleep deprivation")
    if stress_level >= 8: risk_factors.append("high stress")
    if exercise_frequency == "None": risk_factors.append("sedentary lifestyle")
    if nutrition_quality == "Poor": risk_factors.append("poor nutrition")
    
    if len(risk_factors) >= 3:
        st.error("**Multiple Risk Factors**: Consider prioritizing lifestyle changes to support fertility.")
    elif len(risk_factors) >= 2:
        st.warning("**Some Risk Factors**: Address these areas to optimize your fertility health.")
    
    # Wearable data recommendations (if available)
    if wearable_df is not None and "Sleep" in wearable_df.columns:
        avg_sleep = wearable_df["Sleep"].mean()
        if avg_sleep < 6: 
            st.warning("**Wearable Data**: Your device shows sleep below 6 hours — prioritize rest!")
        elif avg_sleep >= 8:
            st.success("**Wearable Data**: Great sleep patterns detected by your device!")

    if wearable_df is not None and "Steps" in wearable_df.columns:
        avg_steps = wearable_df["Steps"].mean()
        if avg_steps < 3000: 
            st.warning("**Wearable Data**: Low activity detected — aim for 7,000+ daily steps!")
        elif avg_steps >= 7000:
            st.success("**Wearable Data**: Excellent activity levels tracked by your device!")

    # Advanced Analytics Dashboard
    st.subheader("Advanced Health Analytics Dashboard")
    
    # Create health score calculation
    health_scores = {}
    
    # Sleep Score (0-100)
    if sleep_hours >= 8:
        health_scores['Sleep'] = 100
    elif sleep_hours >= 7:
        health_scores['Sleep'] = 80
    elif sleep_hours >= 6:
        health_scores['Sleep'] = 60
    else:
        health_scores['Sleep'] = 30
    
    # Stress Score (0-100) - inverted scale
    health_scores['Stress Management'] = max(0, 100 - (stress_level * 10))
    
    # Nutrition Score (0-100)
    nutrition_scores = {"Poor": 20, "Average": 50, "Good": 80, "Excellent": 100}
    health_scores['Nutrition'] = nutrition_scores.get(nutrition_quality, 50)
    
    # Hydration Score (0-100)
    if hydration >= 10:
        health_scores['Hydration'] = 100
    elif hydration >= 8:
        health_scores['Hydration'] = 80
    elif hydration >= 6:
        health_scores['Hydration'] = 60
    else:
        health_scores['Hydration'] = 40
    
    # Exercise Score (0-100)
    exercise_scores = {"None": 20, "1-2 times/week": 50, "3-4 times/week": 80, "5+ times/week": 90}
    health_scores['Exercise'] = exercise_scores.get(exercise_frequency, 50)
    
    # BBT Tracking Score (0-100)
    if bbt_tracking == "Not Tracking":
        health_scores['BBT Tracking'] = 0
    elif bbt_consistency >= 8:
        health_scores['BBT Tracking'] = 100
    elif bbt_consistency >= 6:
        health_scores['BBT Tracking'] = 70
    else:
        health_scores['BBT Tracking'] = 40
    
    # Display health scores
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Sleep Quality", f"{health_scores['Sleep']}/100", 
                 delta=f"{health_scores['Sleep']-50}" if health_scores['Sleep'] != 50 else None)
        st.metric("Stress Management", f"{health_scores['Stress Management']}/100",
                 delta=f"{health_scores['Stress Management']-50}" if health_scores['Stress Management'] != 50 else None)
    
    with col2:
        st.metric("Nutrition", f"{health_scores['Nutrition']}/100",
                 delta=f"{health_scores['Nutrition']-50}" if health_scores['Nutrition'] != 50 else None)
        st.metric("Hydration", f"{health_scores['Hydration']}/100",
                 delta=f"{health_scores['Hydration']-50}" if health_scores['Hydration'] != 50 else None)
    
    with col3:
        st.metric("Exercise", f"{health_scores['Exercise']}/100",
                 delta=f"{health_scores['Exercise']-50}" if health_scores['Exercise'] != 50 else None)
        st.metric("BBT Tracking", f"{health_scores['BBT Tracking']}/100",
                 delta=f"{health_scores['BBT Tracking']-50}" if health_scores['BBT Tracking'] != 50 else None)
    
    # Overall Health Score
    overall_score = sum(health_scores.values()) / len(health_scores)
    st.subheader(f"Overall Health Score: {overall_score:.0f}/100")
    
    # Health score interpretation
    if overall_score >= 80:
        st.success("**Excellent Health Profile**: Your lifestyle choices strongly support reproductive health!")
    elif overall_score >= 60:
        st.info("**Good Health Profile**: You're on the right track with room for improvement.")
    elif overall_score >= 40:
        st.warning("**Moderate Health Profile**: Consider focusing on key areas for better fertility outcomes.")
    else:
        st.error("**Health Profile Needs Attention**: Prioritize lifestyle changes to support fertility.")
    
    # Trend Analysis (if wearable data available)
    if wearable_df is not None and len(wearable_df) > 7:
        st.subheader("Trend Analysis")
        
        # Calculate weekly averages
        if 'date' in wearable_df.columns:
            wearable_df['week'] = wearable_df['date'].dt.isocalendar().week
            weekly_avg = wearable_df.groupby('week').mean()
            
            # Show trends for key metrics
            for col in ['Sleep', 'Steps', 'BBT']:
                if col in weekly_avg.columns:
                    trend = weekly_avg[col].diff().mean()
                    if trend > 0:
                        st.success(f"{col} showing positive trend (+{trend:.2f} per week)")
                    elif trend < 0:
                        st.warning(f"{col} showing declining trend ({trend:.2f} per week)")
                    else:
                        st.info(f"{col} showing stable trend")
    
    # Risk Assessment
    st.subheader("Risk Assessment")
    risk_factors = []
    
    if sleep_hours < 6:
        risk_factors.append("Sleep deprivation")
    if stress_level >= 8:
        risk_factors.append("High stress levels")
    if exercise_frequency == "None":
        risk_factors.append("Sedentary lifestyle")
    if nutrition_quality == "Poor":
        risk_factors.append("Poor nutrition")
    if alcohol_consumption == "Frequent":
        risk_factors.append("Excessive alcohol consumption")
    if smoking_status == "Current smoker":
        risk_factors.append("Smoking")
    if "PCOS" in health_conditions:
        risk_factors.append("PCOS condition")
    if "Thyroid Issues" in health_conditions:
        risk_factors.append("Thyroid dysfunction")
    
    if risk_factors:
        st.warning(f"**Identified Risk Factors**: {', '.join(risk_factors)}")
        st.info("**Recommendation**: Address these risk factors to optimize your fertility health.")
    else:
        st.success("**No significant risk factors identified** - Great job maintaining a healthy lifestyle!")
    
    # Fertility Optimization Tips
    st.subheader("Fertility Optimization Tips")
    
    optimization_tips = []
    if health_scores['Sleep'] < 70:
        optimization_tips.append("• Prioritize 7-9 hours of quality sleep nightly")
    if health_scores['Stress Management'] < 70:
        optimization_tips.append("• Practice daily stress-reduction techniques (meditation, yoga)")
    if health_scores['Exercise'] < 70:
        optimization_tips.append("• Engage in moderate exercise 3-4 times per week")
    if health_scores['Nutrition'] < 70:
        optimization_tips.append("• Focus on fertility-supporting foods (leafy greens, lean proteins)")
    if health_scores['BBT Tracking'] < 50:
        optimization_tips.append("• Start tracking basal body temperature for better cycle insights")
    
    if optimization_tips:
        for tip in optimization_tips:
            st.info(tip)
    else:
        st.success("**Excellent!** You're already following most fertility optimization practices!")

    # Teleconsultation
    st.subheader("Need Expert Help?")
    st.markdown("[Book a Teleconsultation](http://localhost:5173/consultation)")
else:
    st.info("Enter your cycle details and click **Predict Fertile Window** to get started.")


# ------------------------------
# Gemini AI Integration for Personalized Insights
# ------------------------------
st.sidebar.header("AI Insights")

if st.sidebar.button("Get AI Insights"):
    with st.spinner("Generating personalized AI insights..."):
        try:
            # Compose comprehensive prompt for Gemini AI
            prompt = f"""
You are an expert fertility health assistant with advanced knowledge in reproductive health, lifestyle medicine, and personalized wellness. Given the following comprehensive health data, provide detailed, personalized fertility and lifestyle insights:

MENSTRUAL CYCLE DATA:
- Last period start date: {start_date.strftime('%Y-%m-%d')}
- Average cycle length: {cycle_length} days
- Period duration: {period_duration} days
- Flow intensity: {flow_intensity}

BASAL BODY TEMPERATURE (BBT):
- Current BBT: {current_bbt}°F
- BBT tracking method: {bbt_tracking}
- BBT measurement consistency (1-10): {bbt_consistency}

LIFESTYLE HABITS:
- Stress level (1-10): {stress_level}
- Daily hydration (cups): {hydration}
- Nutrition quality: {nutrition_quality}
- Average sleep hours: {sleep_hours}
- Exercise frequency: {exercise_frequency}
- Alcohol consumption: {alcohol_consumption}
- Smoking status: {smoking_status}

HEALTH & SUPPLEMENTS:
- Current supplements: {', '.join(supplements) if supplements else 'None'}
- Health conditions: {', '.join(health_conditions) if health_conditions else 'None'}
- Current medications: {medications if medications else 'None'}

Please provide:
1. Personalized fertility insights based on this data
2. Specific lifestyle recommendations for improving reproductive health
3. Risk factors to address
4. Positive habits to maintain
5. When to consider professional medical consultation
6. Evidence-based advice for optimizing fertility

Focus on actionable, personalized recommendations that consider the individual's complete health profile.
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

            st.subheader("AI-Generated Personalized Insights")
            st.markdown(ai_text)

        except Exception as e:
            st.error(f"Error generating AI insights: {e}")

# ------------------------------
# Chatbot Integration
# ------------------------------
st.sidebar.header("AI Chatbot")

# Initialize session state for chat
if 'chat_messages' not in st.session_state:
    st.session_state.chat_messages = []
if 'chat_active' not in st.session_state:
    st.session_state.chat_active = False

# Chatbot button
if st.sidebar.button("Start Chat", type="primary"):
    st.session_state.chat_active = not st.session_state.chat_active

# Chat interface
if st.session_state.chat_active:
    st.markdown("---")
    st.subheader("Fertility Health Assistant")
    st.markdown("Ask me anything about fertility, menstrual health, or wellness!")

    # Display chat history
    chat_container = st.container()
    with chat_container:
        for message in st.session_state.chat_messages:
            if message['role'] == 'user':
                st.markdown(f"**You:** {message['content']}")
            else:
                st.markdown(f"**Assistant:** {message['content']}")

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

                # Prepare comprehensive context for chatbot
                user_data = format_user_data_for_chatbot({
                    'start_date': start_date,
                    'cycle_length': cycle_length,
                    'period_duration': period_duration,
                    'flow_intensity': flow_intensity,
                    'current_bbt': current_bbt,
                    'bbt_tracking': bbt_tracking,
                    'bbt_consistency': bbt_consistency,
                    'stress_level': stress_level,
                    'hydration': hydration,
                    'nutrition_quality': nutrition_quality,
                    'sleep_hours': sleep_hours,
                    'exercise_frequency': exercise_frequency,
                    'alcohol_consumption': alcohol_consumption,
                    'smoking_status': smoking_status,
                    'supplements': supplements,
                    'health_conditions': health_conditions,
                    'medications': medications
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