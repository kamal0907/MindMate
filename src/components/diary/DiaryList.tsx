import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import DiaryEntryComponent from './DiaryEntry';
import { BookOpen, Loader2 } from 'lucide-react';

const DiaryList: React.FC = () => {
  const { diaryEntries, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!diaryEntries || diaryEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <BookOpen className="mx-auto text-gray-400 mb-3" size={48} />
        <h3 className="text-lg font-medium text-gray-800 mb-2">Your diary is empty</h3>
        <p className="text-gray-600">
          Start writing your thoughts and feelings to track your emotional journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {diaryEntries.map(entry => (
        <DiaryEntryComponent key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default DiaryList;