import React, { useState } from 'react';
import { useDiary } from '../contexts/DiaryContext';
import { useAppContext } from '../contexts/AppContext';
import { EmotionType } from '../types';
import EmergencySupport from '../components/layout/EmergencySupport';

const DiaryPage: React.FC = () => {
  const { entries, loading, error, addEntry, refreshEntries } = useDiary();
  const [content, setContent] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<{ type: EmotionType; intensity: number }[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showEmergencySupport, setShowEmergencySupport } = useAppContext();

  const emotions: EmotionType[] = [
    'happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'grateful', 'hopeful'
  ];

  const handleEmotionChange = (emotion: EmotionType, intensity: number) => {
    setSelectedEmotions(prev => {
      const existing = prev.find(e => e.type === emotion);
      if (existing) {
        return prev.map(e => e.type === emotion ? { ...e, intensity } : e);
      }
      return [...prev, { type: emotion, intensity }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await addEntry({
        content,
        emotions: selectedEmotions,
        isPublic
      });

      // Reset form
      setContent('');
      setSelectedEmotions([]);
      setIsPublic(false);
      
      // Refresh entries to get the latest data
      await refreshEntries();
    } catch (err) {
      console.error('Error submitting diary entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Diary</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                How are you feeling today?
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Write your thoughts here..."
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Emotions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {emotions.map((emotion) => (
                  <div key={emotion} className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1 capitalize">
                      {emotion}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={selectedEmotions.find(e => e.type === emotion)?.intensity || 0}
                      onChange={(e) => handleEmotionChange(emotion, parseInt(e.target.value))}
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-gray-700">Make this entry public</span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </button>
          </form>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About Your Diary</h2>
            <p className="text-gray-600 mb-3">
              Your diary entries are analyzed to detect emotions and provide insights about your mental well-being.
            </p>
            <p className="text-gray-600 mb-3">
              You can choose to make entries private or public. Public entries can receive supportive comments from the community.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-1">Tip</h3>
              <p className="text-sm text-gray-700">
                Writing about your emotions regularly helps improve self-awareness and emotional regulation.
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {entries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Entries Yet</h3>
              <p className="text-gray-600">
                Start your journaling journey by writing your first diary entry. Express your thoughts and emotions freely.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    {entry.isPublic && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Public
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 mb-4">{entry.content}</p>
                  {entry.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.emotions.map((emotion, i) => (
                        <span
                          key={i}
                          className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                        >
                          {emotion.type} ({emotion.intensity}/10)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showEmergencySupport && (
        <EmergencySupport onClose={() => setShowEmergencySupport(false)} />
      )}
    </div>
  );
};

export default DiaryPage;