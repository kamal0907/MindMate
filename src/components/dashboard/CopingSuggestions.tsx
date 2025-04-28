import React, { useState } from 'react';
import { Lightbulb, ExternalLink, Play, Quote, Wind, Activity } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { EmotionType, CopingSuggestion } from '../../types';
import { getEmotionEmoji } from '../../utils/emotionUtils';

const CopingSuggestions: React.FC = () => {
  const { dailyEmotion, getCopingSuggestions } = useAppContext();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(dailyEmotion || 'anxious');
  
  const emotions: EmotionType[] = [
    'anxious', 'stressed', 'sad', 'angry', 'overwhelmed', 'neutral', 'hopeful'
  ];
  
  const suggestions = getCopingSuggestions(selectedEmotion);
  
  const getSuggestionIcon = (type: CopingSuggestion['type']) => {
    switch (type) {
      case 'breathing':
        return <Wind size={18} className="text-blue-500" />;
      case 'quote':
        return <Quote size={18} className="text-purple-500" />;
      case 'video':
        return <Play size={18} className="text-red-500" />;
      case 'activity':
        return <Activity size={18} className="text-green-500" />;
      default:
        return <Lightbulb size={18} className="text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Lightbulb className="text-yellow-500 mr-2" size={22} />
        <h2 className="text-xl font-semibold text-gray-800">Coping Suggestions</h2>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select how you're feeling:
        </label>
        <div className="flex flex-wrap gap-2">
          {emotions.map(emotion => (
            <button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedEmotion === emotion
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{getEmotionEmoji(emotion)}</span>
              {emotion}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <p className="text-gray-500 italic">No suggestions available for this emotion.</p>
        ) : (
          suggestions.map(suggestion => (
            <div 
              key={suggestion.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center mb-2">
                {getSuggestionIcon(suggestion.type)}
                <span className="ml-2 font-medium text-gray-800 capitalize">
                  {suggestion.type}
                </span>
              </div>
              
              {suggestion.type === 'video' ? (
                <a
                  href={suggestion.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Watch video <ExternalLink size={14} className="ml-1" />
                </a>
              ) : (
                <p className="text-gray-700">{suggestion.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CopingSuggestions;