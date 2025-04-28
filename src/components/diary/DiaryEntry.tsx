import React, { useState } from 'react';
import { Calendar, Clock, ThumbsUp, MessageCircle, Lock, Globe, Trash2, Edit2 } from 'lucide-react';
import { DiaryEntry as DiaryEntryType } from '../../types';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { getEmotionEmoji, getEmotionColor } from '../../utils/emotionUtils';
import { useAppContext } from '../../contexts/AppContext';

interface DiaryEntryProps {
  entry: DiaryEntryType;
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({ entry }) => {
  const { updateDiaryEntry, deleteDiaryEntry } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 5)); // Mock likes

  const handleEditSubmit = () => {
    if (editContent.trim().length === 0) return;
    
    updateDiaryEntry(entry.id, { content: editContent });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteDiaryEntry(entry.id);
    } else {
      setConfirmDelete(true);
      // Reset confirm state after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleTogglePublic = () => {
    updateDiaryEntry(entry.id, { isPublic: !entry.isPublic });
  };

  const handleLikeClick = () => {
    if (!showLikes) {
      setLikeCount(likeCount + 1);
      setShowLikes(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(entry.date)}</span>
          <Clock size={14} className="ml-3 mr-1" />
          <span>{formatTime(entry.date)}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleTogglePublic}
            className={`p-1.5 rounded-full transition-colors ${
              entry.isPublic
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={entry.isPublic ? "Make private" : "Make public"}
          >
            {entry.isPublic ? <Globe size={16} /> : <Lock size={16} />}
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            title="Edit entry"
          >
            <Edit2 size={16} />
          </button>
          
          <button
            onClick={handleDelete}
            className={`p-1.5 rounded-full transition-colors ${
              confirmDelete
                ? 'bg-red-100 text-red-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-red-600'
            }`}
            title={confirmDelete ? "Click again to confirm" : "Delete entry"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {entry.emotions.map((emotion, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${getEmotionColor(emotion.type)}20`, // Using hex opacity
              color: getEmotionColor(emotion.type)
            }}
          >
            {getEmotionEmoji(emotion.type)} {emotion.type} ({emotion.intensity}/10)
          </span>
        ))}
      </div>
      
      {entry.isPublic && (
        <div className="flex items-center mt-2 pt-3 border-t border-gray-100">
          <button
            onClick={handleLikeClick}
            className={`flex items-center mr-4 text-sm ${
              showLikes ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            } transition-colors`}
          >
            <ThumbsUp size={16} className="mr-1" />
            <span>{likeCount}</span>
          </button>
          
          <button className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <MessageCircle size={16} className="mr-1" />
            <span>Reply</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DiaryEntry;