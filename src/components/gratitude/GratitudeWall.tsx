import React, { useState } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatDate } from '../../utils/dateUtils';

const GratitudeWall: React.FC = () => {
  const { gratitudeEntries, addGratitudeEntry, deleteGratitudeEntry } = useAppContext();
  const [newEntry, setNewEntry] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newEntry.trim().length === 0) return;
    
    addGratitudeEntry(newEntry);
    setNewEntry('');
    setIsAdding(false);
  };

  // Random pastel colors for cards
  const getRandomColor = () => {
    const colors = [
      'bg-blue-50 border-blue-200',
      'bg-green-50 border-green-200',
      'bg-yellow-50 border-yellow-200',
      'bg-purple-50 border-purple-200',
      'bg-pink-50 border-pink-200',
      'bg-indigo-50 border-indigo-200',
      'bg-red-50 border-red-200',
      'bg-orange-50 border-orange-200',
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Heart className="text-red-500 mr-2" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Gratitude Wall</h2>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add Gratitude
          </button>
        )}
      </div>
      
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-blue-800">What are you grateful for today?</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X size={18} />
            </button>
          </div>
          
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="I'm grateful for..."
            className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] mb-3"
            maxLength={200}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-blue-600">
              {newEntry.length}/200 characters
            </p>
            <button
              type="submit"
              disabled={newEntry.trim().length === 0}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                newEntry.trim().length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Save
            </button>
          </div>
        </form>
      )}
      
      {gratitudeEntries.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Your gratitude wall is empty</h3>
          <p className="text-gray-500">
            Start adding things you're grateful for to improve your mental wellbeing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gratitudeEntries.map((entry) => {
            const colorClass = getRandomColor();
            
            return (
              <div
                key={entry.id}
                className={`${colorClass} p-4 rounded-lg border relative transition-transform duration-200 transform hover:-translate-y-1 hover:shadow-md`}
              >
                <button
                  onClick={() => deleteGratitudeEntry(entry.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
                
                <p className="text-gray-700 mb-3 pt-2">{entry.content}</p>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Heart size={12} className="text-red-400 mr-1" />
                  <span>{formatDate(entry.date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GratitudeWall;