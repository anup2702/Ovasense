# 📊 Sample Wearable Data Files for OvaSense

This directory contains sample CSV files that demonstrate different health scenarios for testing the enhanced OvaSense fertility tracking application.

## 📁 Available Sample Files

### 1. `sample_wearable_data.csv` - **Healthy Lifestyle Pattern**
- **Description**: Represents a person with consistent, healthy lifestyle habits
- **Characteristics**:
  - Regular sleep patterns (6.5-8.5 hours)
  - Good activity levels (7,000-10,000 steps daily)
  - Stable heart rate (65-78 bpm)
  - Consistent BBT tracking (97.0-97.8°F)
  - Moderate weight fluctuations
  - Regular exercise (35-55 active minutes)

### 2. `sample_wearable_data_irregular.csv` - **Irregular/Stressful Lifestyle**
- **Description**: Represents someone with inconsistent health patterns
- **Characteristics**:
  - Irregular sleep (4.2-8.3 hours)
  - Variable activity levels (2,900-9,500 steps)
  - Higher stress indicators (heart rate 64-95 bpm)
  - Fluctuating BBT (97.0-98.2°F)
  - Weight management challenges
  - Inconsistent exercise patterns

### 3. `sample_bbt_data.csv` - **BBT-Focused Tracking**
- **Description**: Demonstrates clear BBT patterns for ovulation prediction
- **Characteristics**:
  - Consistent sleep (7.6-8.4 hours)
  - Good activity levels (7,400-10,100 steps)
  - Stable heart rate (61-70 bpm)
  - **Clear BBT rise pattern** (97.1°F to 102.9°F over 2 months)
  - Gradual weight loss trend
  - Regular exercise (39-55 active minutes)

## 🔧 How to Use These Files

### Step 1: Upload Data
1. Run the OvaSense application: `streamlit run app.py`
2. In the sidebar, scroll to the "📁 Data Upload" section
3. Click "📤 Upload Wearable Data (CSV/JSON)"
4. Select one of the sample CSV files

### Step 2: View Analysis
After uploading, you'll see:
- **Data Preview**: First few rows of your data
- **Data Quality Analysis**: Missing values and completeness scores
- **Data Range Validation**: Min/max values with outlier detection
- **Enhanced Predictions**: AI model using your wearable data
- **Personalized Recommendations**: Based on your health patterns
- **Advanced Analytics**: Health scores and trend analysis

## 📈 What Each File Demonstrates

### Healthy Lifestyle (`sample_wearable_data.csv`)
- **High confidence predictions** (80-90% accuracy)
- **Positive health scores** across all metrics
- **Stable trends** in wearable data
- **Few risk factors** identified
- **Optimization tips** for maintaining good habits

### Irregular Lifestyle (`sample_wearable_data_irregular.csv`)
- **Lower confidence predictions** (60-70% accuracy)
- **Variable health scores** with some areas needing improvement
- **Inconsistent trends** in wearable data
- **Multiple risk factors** identified
- **Comprehensive optimization recommendations**

### BBT-Focused (`sample_bbt_data.csv`)
- **Highest confidence predictions** (85-95% accuracy)
- **Excellent BBT tracking scores**
- **Clear ovulation patterns** visible in temperature data
- **Optimal health scores** across most metrics
- **Advanced trend analysis** showing BBT progression

## 🎯 Expected Results

### Data Quality Analysis
- **Completeness Scores**: 100% for all sample files
- **Range Validation**: All values within expected ranges
- **Outlier Detection**: Minimal outliers in healthy data, more in irregular data

### AI Model Confidence
- **Healthy Data**: 80-90% confidence
- **Irregular Data**: 60-70% confidence  
- **BBT Data**: 85-95% confidence

### Health Scores (0-100 scale)
- **Sleep Quality**: Based on hours tracked
- **Stress Management**: Inverted stress level scale
- **Nutrition**: Based on quality selection
- **Hydration**: Based on water intake
- **Exercise**: Based on frequency
- **BBT Tracking**: Based on consistency and method

### Personalized Recommendations
Each file will generate different recommendations:
- **Healthy**: Maintenance and optimization tips
- **Irregular**: Priority areas for improvement
- **BBT**: Advanced tracking and cycle insights

## 🔬 Technical Details

### CSV Format Requirements
```csv
date,Sleep,Steps,Heart_Rate,BBT,Weight,Calories_Burned,Active_Minutes
2024-01-01,7.5,8500,72,97.2,135.2,2100,45
```

### Required Columns
- **date**: Date in YYYY-MM-DD format
- **Sleep**: Hours of sleep (decimal format)
- **Steps**: Daily step count
- **Heart_Rate**: Resting heart rate (bpm)
- **BBT**: Basal body temperature (°F)
- **Weight**: Body weight (lbs)
- **Calories_Burned**: Daily calories burned
- **Active_Minutes**: Minutes of active exercise

### Data Validation
The application will automatically:
- ✅ Check for missing values
- ✅ Validate data ranges
- ✅ Flag potential outliers
- ✅ Calculate completeness scores
- ✅ Provide quality recommendations

## 🚀 Getting Started

1. **Choose a sample file** based on the scenario you want to test
2. **Upload the file** in the OvaSense application
3. **Fill in the sidebar inputs** (cycle data, lifestyle habits, etc.)
4. **Click "🔮 Predict Fertile Window (Advanced AI Model)"**
5. **Explore the comprehensive analysis** and personalized recommendations

## 💡 Tips for Best Results

- **Use BBT data** for highest prediction accuracy
- **Consistent tracking** improves AI model confidence
- **Complete lifestyle data** provides better recommendations
- **Regular uploads** enable trend analysis
- **Health condition awareness** adjusts predictions appropriately

---

**Note**: These are sample files for testing purposes. Replace with your actual wearable device data for personalized fertility tracking.
