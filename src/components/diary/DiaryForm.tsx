import React, { useState } from 'react';
import { PenLine, Lock, Globe, Smile } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { analyzeEmotions } from '../../utils/emotionUtils';
import { EmotionType } from '../../types';
import { getEmotionEmoji } from '../../utils/emotionUtils';

const DiaryForm: React.FC = () => {
  const { addDiaryEntry } = useAppContext();
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedEmotions, setDetectedEmotions] = useState<EmotionType[]>([]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Analyze emotions as user types, but throttle to avoid excessive processing
    if (e.target.value.length > 10) {
      clearTimeout(window.globalTimeout);
      window.globalTimeout = setTimeout(() => {
        const emotions = analyzeEmotions(e.target.value);
        setDetectedEmotions(emotions);
      }, 500);
    } else {
      setDetectedEmotions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim().length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate emotion analysis delay
    setTimeout(() => {
      addDiaryEntry(content, isPublic);
      setContent('');
      setIsPublic(false);
      setDetectedEmotions([]);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <PenLine className="text-blue-600 mr-2" size={22} />
        <h2 className="text-xl font-semibold text-gray-800">Write in your diary</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="How are you feeling today? Share your thoughts..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] transition duration-200"
            disabled={isAnalyzing}
          />
        </div>
        
        {detectedEmotions.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 flex items-center">
              <Smile className="text-blue-600 mr-1.5" size={16} /> 
              Detected emotions:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {detectedEmotions.map((emotion, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {getEmotionEmoji(emotion)} {emotion}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium mr-2 ${
              isPublic
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {isPublic ? (
              <>
                <Globe className="mr-1.5" size={16} /> Public
              </>
            ) : (
              <>
                <Lock className="mr-1.5" size={16} /> Private
              </>
            )}
          </button>
          <span className="text-xs text-gray-500">
            {isPublic 
              ? "Others can view and respond to this entry" 
              : "Only you can see this entry"}
          </span>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={content.trim().length === 0 || isAnalyzing}
            className={`px-4 py-2 rounded-md text-white font-medium transition duration-200 ${
              content.trim().length === 0 || isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isAnalyzing ? 'Analyzing emotions...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Need to extend the Window interface to allow our global timeout property
declare global {
  interface Window {
    globalTimeout: ReturnType<typeof setTimeout>;
  }
}

export default DiaryForm;