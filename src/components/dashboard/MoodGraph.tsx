import React, { useState } from 'react';
import { BarChart2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { DiaryEntry, EmotionType } from '../../types';
import { formatShortDate, getPastDays } from '../../utils/dateUtils';
import { getEmotionColor, getEmotionEmoji } from '../../utils/emotionUtils';

interface MoodGraphProps {
  diaryEntries: DiaryEntry[];
}

const MoodGraph: React.FC<MoodGraphProps> = ({ diaryEntries }) => {
  const [timeRange, setTimeRange] = useState<number>(7); // 7 days by default
  
  // Get data for the past days
  const pastDays = getPastDays(timeRange);
  
  // Prepare data for the graph
  const graphData = pastDays.map(day => {
    const dateStr = day.toISOString().split('T')[0];
    // Find entries for this day
    const entriesForDay = diaryEntries.filter(entry => 
      entry.date.split('T')[0] === dateStr
    );
    
    // Get all emotions for the day
    let emotions: EmotionType[] = [];
    entriesForDay.forEach(entry => {
      emotions = [...emotions, ...entry.emotions.map(e => e.type)];
    });
    
    // Find most common emotion for the day
    let dominantEmotion: EmotionType | null = null;
    let maxCount = 0;
    
    // Count emotions
    const emotionCounts: Record<string, number> = {};
    emotions.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      if (emotionCounts[emotion] > maxCount) {
        maxCount = emotionCounts[emotion];
        dominantEmotion = emotion;
      }
    });
    
    // Find average intensity
    let totalIntensity = 0;
    let intensityCount = 0;
    
    entriesForDay.forEach(entry => {
      entry.emotions.forEach(emotion => {
        totalIntensity += emotion.intensity;
        intensityCount++;
      });
    });
    
    const averageIntensity = intensityCount > 0 ? totalIntensity / intensityCount : 0;
    
    return {
      date: dateStr,
      displayDate: formatShortDate(day),
      emotion: dominantEmotion || 'neutral',
      intensity: Math.round(averageIntensity),
      hasEntries: entriesForDay.length > 0
    };
  });
  
  const handleTimeRangeChange = (newRange: number) => {
    setTimeRange(newRange);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart2 className="text-blue-600 mr-2" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Mood Trends</h2>
        </div>
        
        <div className="flex space-x-2">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => handleTimeRangeChange(days)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-end mb-2">
        <div className="w-16 text-xs text-gray-500">Intensity</div>
        <div className="flex-1 grid grid-cols-7 gap-2 overflow-x-auto">
          {timeRange > 7 && (
            <button className="text-gray-400 hover:text-gray-600">
              <ChevronLeft size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* Graph */}
      <div className="flex">
        {/* Y-axis */}
        <div className="w-16 flex flex-col justify-between h-[200px] pr-2">
          {[10, 8, 6, 4, 2, 0].map(level => (
            <div key={level} className="text-xs text-gray-500 text-right">
              {level}
            </div>
          ))}
        </div>
        
        {/* Bars */}
        <div className="flex-1 h-[200px] grid grid-cols-7 gap-2 items-end">
          {graphData.slice(0, 7).map((day, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <div 
                className="w-full transition-all duration-500 rounded-t-sm"
                style={{
                  height: day.hasEntries ? `${day.intensity * 10}%` : '5%',
                  backgroundColor: day.hasEntries 
                    ? getEmotionColor(day.emotion as EmotionType) 
                    : '#e5e7eb',
                  minHeight: '4px'
                }}
              ></div>
              
              <div className="mt-2 text-center">
                {day.hasEntries && (
                  <span className="text-lg" title={day.emotion as string}>
                    {getEmotionEmoji(day.emotion as EmotionType)}
                  </span>
                )}
                <div className="text-xs text-gray-500 mt-1">{day.displayDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Insights</h3>
        <p className="text-sm text-gray-700">
          {graphData.filter(d => d.hasEntries).length === 0 ? (
            "Start adding diary entries to see your mood patterns and insights."
          ) : (
            "Your mood tends to be more positive on weekends. Consider what activities during this time contribute to your wellbeing."
          )}
        </p>
      </div>
    </div>
  );
};

export default MoodGraph;