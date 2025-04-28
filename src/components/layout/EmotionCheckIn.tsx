import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { EmotionType } from '../../types';
import { getEmotionEmoji, getEmotionColor } from '../../utils/emotionUtils';

const EmotionCheckIn: React.FC = () => {
  const { dailyEmotion, setDailyEmotion } = useAppContext();

  const emotions: EmotionType[] = [
    'happy', 'excited', 'calm', 'grateful', 'neutral', 
    'sad', 'anxious', 'stressed', 'angry', 'overwhelmed'
  ];

  const handleEmotionSelect = (emotion: EmotionType) => {
    setDailyEmotion(emotion);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        {dailyEmotion 
          ? `Today you're feeling ${dailyEmotion} ${getEmotionEmoji(dailyEmotion)}`
          : "How are you feeling today?"}
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion) => (
          <button
            key={emotion}
            onClick={() => handleEmotionSelect(emotion)}
            className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              dailyEmotion === emotion
                ? `bg-${getEmotionColor(emotion).substring(1)} text-white ring-2 ring-offset-2 ring-${getEmotionColor(emotion).substring(1)}`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={dailyEmotion === emotion ? { backgroundColor: getEmotionColor(emotion) } : {}}
          >
            <span className="mr-1">{getEmotionEmoji(emotion)}</span>
            {emotion}
          </button>
        ))}
      </div>
      
      {dailyEmotion && (
        <div className="mt-4">
          <p className="text-gray-600">
            Tracking your daily emotions helps identify patterns and improve well-being.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionCheckIn;