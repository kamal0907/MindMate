import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MoodGraph from '../components/dashboard/MoodGraph';
import EmotionCloud from '../components/dashboard/EmotionCloud';
import CopingSuggestions from '../components/dashboard/CopingSuggestions';

const DashboardPage: React.FC = () => {
  const { diaryEntries } = useAppContext();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <MoodGraph diaryEntries={diaryEntries} />
        <EmotionCloud diaryEntries={diaryEntries} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CopingSuggestions />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Insights & Tips</h2>
          
          {diaryEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Start writing diary entries to receive personalized insights and tips.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-1">Pattern Detected</h3>
                <p className="text-gray-700">
                  You tend to feel more anxious in the evenings. Consider establishing a calming evening routine.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-1">Progress Note</h3>
                <p className="text-gray-700">
                  Your overall mood has improved by 15% compared to last week. Keep up the good work!
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-1">Recommendation</h3>
                <p className="text-gray-700">
                  Try journaling specifically about your gratitude. Studies show this can significantly boost mood and reduce anxiety.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-1">Self-Care Reminder</h3>
                <p className="text-gray-700">
                  Have you taken time for yourself today? Even 5 minutes of mindful breathing can reduce stress levels.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;