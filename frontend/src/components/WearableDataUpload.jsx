import React, { useState } from 'react';
import aiService from '../services/aiService';

const WearableDataUpload = ({ onDataUpload, wearableData, userData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let data;

        if (file.name.endsWith('.csv')) {
          data = parseCSV(content);
        } else if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else {
          throw new Error('Unsupported file format. Please upload CSV or JSON files.');
        }

        // Validate data before processing
        if (!data || data.length === 0) {
          throw new Error('No data found in the file. Please check your file format.');
        }

        if (!data[0] || Object.keys(data[0]).length === 0) {
          throw new Error('Invalid data format. Please ensure your file has proper headers and data.');
        }

        // Process and validate data
        const processedData = processWearableData(data);
        onDataUpload(processedData);
        
        setIsProcessing(false);
      } catch (err) {
        console.error('Error processing wearable data:', err);
        setError(err.message || 'An error occurred while processing the file. Please try again.');
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const generateAIAnalysis = async (processedData) => {
    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzeWearableData(processedData, userData);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      setAiAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseCSV = (content) => {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row.');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      }

      if (data.length === 0) {
        throw new Error('No data rows found in CSV file.');
      }

      return data;
    } catch (error) {
      throw new Error(`Error parsing CSV: ${error.message}`);
    }
  };

  const processWearableData = (data) => {
    // Convert to a more usable format
    const processed = {
      raw: data,
      columns: Object.keys(data[0] || {}),
      length: data.length,
      // Add some basic statistics
      ...Object.keys(data[0] || {}).reduce((acc, key) => {
        if (key.toLowerCase() !== 'date') {
          const values = data.map(row => parseFloat(row[key])).filter(v => !isNaN(v));
          if (values.length > 0) {
            acc[key] = {
              mean: () => values.reduce((sum, val) => sum + val, 0) / values.length,
              min: values.length > 0 ? Math.min(...values) : 0,
              max: values.length > 0 ? Math.max(...values) : 0,
              values: values
            };
          }
        }
        return acc;
      }, {})
    };

    return processed;
  };

  const getDataQualityScore = () => {
    if (!wearableData || !wearableData.raw || !wearableData.columns) return 0;
    
    try {
      const totalCells = wearableData.length * wearableData.columns.length;
      const missingCells = wearableData.raw.reduce((count, row) => {
        return count + Object.values(row).filter(value => !value || value === '').length;
      }, 0);
      
      return Math.round(((totalCells - missingCells) / totalCells) * 100);
    } catch (error) {
      console.error('Error calculating data quality score:', error);
      return 0;
    }
  };

  const validateDataRanges = () => {
    if (!wearableData) return [];
    
    const warnings = [];
    
    try {
      Object.entries(wearableData).forEach(([key, value]) => {
        if (typeof value === 'object' && value && value.min !== undefined && value.max !== undefined) {
          if (key.toLowerCase() === 'bbt' && (value.min < 96 || value.max > 100)) {
            warnings.push(`BBT values outside normal range (96-100°F)`);
          } else if (key.toLowerCase() === 'sleep' && (value.min < 3 || value.max > 12)) {
            warnings.push(`Sleep values outside normal range (3-12 hours)`);
          } else if (key.toLowerCase() === 'steps' && value.max > 50000) {
            warnings.push(`Very high step count detected - verify data accuracy`);
          }
        }
      });
    } catch (error) {
      console.error('Error validating data ranges:', error);
    }
    
    return warnings;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Wearable Data Upload</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Wearable Data (CSV/JSON)
        </label>
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload data from fitness trackers, smartwatches, or health apps
        </p>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2 text-gray-600">Processing data...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {wearableData && (
        <div className="space-y-4">
          {/* Data Preview */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {wearableData.columns.slice(0, 5).map((column, index) => (
                      <th key={index} className="border border-gray-300 px-2 py-1 text-left">
                        {column}
                      </th>
                    ))}
                    {wearableData.columns.length > 5 && (
                      <th className="border border-gray-300 px-2 py-1 text-left">...</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {wearableData.raw.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {wearableData.columns.slice(0, 5).map((column, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 px-2 py-1">
                          {row[column]}
                        </td>
                      ))}
                      {wearableData.columns.length > 5 && (
                        <td className="border border-gray-300 px-2 py-1">...</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Quality Analysis */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Data Quality Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800">Data Completeness</h5>
                <p className="text-2xl font-bold text-blue-600">{getDataQualityScore()}%</p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800">Total Records</h5>
                <p className="text-2xl font-bold text-green-600">{wearableData.length}</p>
              </div>
            </div>
          </div>

          {/* Data Range Validation */}
          {validateDataRanges().length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-2">Data Range Validation</h4>
              <div className="space-y-2">
                {validateDataRanges().map((warning, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">Warning: {warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Statistics */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Data Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(wearableData).map(([key, value]) => {
                if (typeof value === 'object' && value && value.min !== undefined && value.max !== undefined && typeof value.mean === 'function') {
                  try {
                    return (
                      <div key={key} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-800">{key}</h5>
                        <p className="text-sm text-gray-600">
                          Range: {value.min.toFixed(2)} - {value.max.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Average: {value.mean().toFixed(2)}
                        </p>
                      </div>
                    );
                  } catch (error) {
                    console.error(`Error displaying statistics for ${key}:`, error);
                    return null;
                  }
                }
                return null;
              })}
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-800">AI Analysis</h4>
              <button
                onClick={() => generateAIAnalysis(wearableData)}
                disabled={isAnalyzing || !wearableData}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
              </button>
            </div>

            {isAnalyzing && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                <span className="ml-2 text-gray-600">AI is analyzing your wearable data...</span>
              </div>
            )}

            {!aiAnalysis && !isAnalyzing && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">Click "Analyze with AI" to get intelligent insights from your wearable data</p>
                <p className="text-sm text-gray-500">AI will identify patterns, correlations, and health insights</p>
              </div>
            )}

            {aiAnalysis && !isAnalyzing && (
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">AI-Powered Data Analysis</h4>
              
              {/* Data Quality */}
              {aiAnalysis.dataQuality && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Data Quality Assessment</h5>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-800 font-medium">Quality Score</span>
                      <span className="text-2xl font-bold text-blue-600">{aiAnalysis.dataQuality.score}%</span>
                    </div>
                    {aiAnalysis.dataQuality.issues && aiAnalysis.dataQuality.issues.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-red-700 font-medium">Issues:</p>
                        <ul className="text-sm text-red-600">
                          {aiAnalysis.dataQuality.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {aiAnalysis.dataQuality.strengths && aiAnalysis.dataQuality.strengths.length > 0 && (
                      <div>
                        <p className="text-sm text-green-700 font-medium">Strengths:</p>
                        <ul className="text-sm text-green-600">
                          {aiAnalysis.dataQuality.strengths.map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Health Insights */}
              {aiAnalysis.healthInsights && aiAnalysis.healthInsights.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Health Insights</h5>
                  <div className="space-y-2">
                    {aiAnalysis.healthInsights.map((insight, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-green-800">{insight.metric}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            insight.trend === 'improving' ? 'bg-green-100 text-green-800' :
                            insight.trend === 'declining' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {insight.trend}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mb-1">{insight.insight}</p>
                        <p className="text-sm text-green-600">{insight.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fertility Correlations */}
              {aiAnalysis.fertilityCorrelations && aiAnalysis.fertilityCorrelations.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Fertility Correlations</h5>
                  <div className="space-y-2">
                    {aiAnalysis.fertilityCorrelations.map((correlation, index) => (
                      <div key={index} className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                        <p className="text-sm text-pink-800 font-medium mb-1">{correlation.pattern}</p>
                        <p className="text-sm text-pink-700 mb-1">{correlation.impact}</p>
                        <p className="text-sm text-pink-600">{correlation.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anomalies */}
              {aiAnalysis.anomalies && aiAnalysis.anomalies.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Data Anomalies</h5>
                  <div className="space-y-2">
                    {aiAnalysis.anomalies.map((anomaly, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-yellow-800">{anomaly.metric}</span>
                          <span className="text-sm text-yellow-600">{anomaly.date}</span>
                        </div>
                        <p className="text-sm text-yellow-700 mb-1">Value: {anomaly.value}</p>
                        <p className="text-sm text-yellow-600">{anomaly.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimization Suggestions */}
              {aiAnalysis.optimizationSuggestions && aiAnalysis.optimizationSuggestions.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Optimization Suggestions</h5>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <ul className="text-sm text-purple-700 space-y-1">
                      {aiAnalysis.optimizationSuggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WearableDataUpload;
