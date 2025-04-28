import React from 'react';
import { Cloud } from 'lucide-react';
import { DiaryEntry, EmotionFrequency } from '../../types';
import { calculateEmotionFrequencies, getEmotionColor, getEmotionEmoji } from '../../utils/emotionUtils';

interface EmotionCloudProps {
  diaryEntries: DiaryEntry[];
}

const EmotionCloud: React.FC<EmotionCloudProps> = ({ diaryEntries }) => {
  const emotionFrequencies = calculateEmotionFrequencies(diaryEntries);
  
  // Filter to only emotions with counts > 0
  const activeEmotions = emotionFrequencies.filter(ef => ef.count > 0);
  
  // Calculate font sizes based on frequency
  const maxCount = Math.max(...activeEmotions.map(ef => ef.count), 1);
  
  const getEmotionSize = (count: number) => {
    const minSize = 1;
    const maxSize = 2.5;
    const ratio = count / maxCount;
    return minSize + ratio * (maxSize - minSize);
  };
  
  // Position emotions in a roughly circular pattern
  const positionEmotions = (emotions: EmotionFrequency[]) => {
    if (emotions.length === 0) return [];
    
    const positions = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 35;
    
    for (let i = 0; i < emotions.length; i++) {
      const angle = (i * (360 / emotions.length)) * (Math.PI / 180);
      const jitter = Math.random() * 10 - 5; // Random offset for more natural look
      
      // Calculate position with slight randomness
      const x = centerX + (radius + jitter) * Math.cos(angle);
      const y = centerY + (radius + jitter) * Math.sin(angle);
      
      positions.push({
        ...emotions[i],
        x: `${x}%`,
        y: `${y}%`,
        size: getEmotionSize(emotions[i].count),
      });
    }
    
    return positions;
  };
  
  const positionedEmotions = positionEmotions(activeEmotions);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Cloud className="text-blue-600 mr-2" size={22} />
        <h2 className="text-xl font-semibold text-gray-800">Your Emotion Cloud</h2>
      </div>
      
      <div className="relative h-[300px] bg-gray-50 rounded-lg mb-4 overflow-hidden">
        {positionedEmotions.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-center">
              Add more diary entries to see your emotion cloud
            </p>
          </div>
        ) : (
          positionedEmotions.map((emotion, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                left: emotion.x,
                top: emotion.y,
                fontSize: `${emotion.size}rem`,
                color: getEmotionColor(emotion.emotion),
                filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))',
                zIndex: Math.floor(emotion.count)
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-center">
                  {getEmotionEmoji(emotion.emotion)}
                </span>
                <span className="text-xs font-medium" style={{ fontSize: '0.75rem' }}>
                  {emotion.emotion}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        <p>This cloud visualizes your most frequent emotions. Larger words appear more often in your diary entries.</p>
      </div>
    </div>
  );
};

export default EmotionCloud;