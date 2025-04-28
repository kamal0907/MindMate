import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, BarChart2, Heart } from 'lucide-react';
import EmotionCheckIn from '../components/layout/EmotionCheckIn';
import { useAppContext } from '../contexts/AppContext';

const HomePage: React.FC = () => {
  const { diaryEntries } = useAppContext();
  
  // Get the three most recent diary entries
  const recentEntries = diaryEntries.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to MindMate</h1>
      
      <EmotionCheckIn />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/diary"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Diary</h2>
            <BookOpen className="text-blue-600" size={22} />
          </div>
          <p className="text-gray-600 mb-4">
            Record your thoughts and emotions to track your mental well-being.
          </p>
          <span className="text-blue-600 font-medium">Write in your diary →</span>
        </Link>
        
        <Link
          to="/chat"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
            <MessageCircle className="text-green-600" size={22} />
          </div>
          <p className="text-gray-600 mb-4">
            Talk with MindMate for emotional support and guidance.
          </p>
          <span className="text-green-600 font-medium">Start chatting →</span>
        </Link>
        
        <Link
          to="/dashboard"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            <BarChart2 className="text-purple-600" size={22} />
          </div>
          <p className="text-gray-600 mb-4">
            View analytics and insights about your emotional patterns.
          </p>
          <span className="text-purple-600 font-medium">See insights →</span>
        </Link>
        
        <Link
          to="/gratitude"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Gratitude</h2>
            <Heart className="text-red-500" size={22} />
          </div>
          <p className="text-gray-600 mb-4">
            Record things you're grateful for to boost positive thinking.
          </p>
          <span className="text-red-500 font-medium">Express gratitude →</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Diary Entries</h2>
        
        {recentEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't written any diary entries yet.</p>
            <Link
              to="/diary"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Write your first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEntries.map(entry => (
              <div 
                key={entry.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <p className="text-gray-800 line-clamp-2 mb-2">{entry.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {entry.emotions.map((emotion, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {emotion.type}
                      </span>
                    ))}
                  </div>
                  <Link 
                    to="/diary" 
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View all →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-8 text-white">
        <h2 className="text-2xl font-bold mb-3">How MindMate Helps</h2>
        <p className="mb-6 opacity-90">
          Research shows tracking emotions improves self-awareness and mental health outcomes. 
          MindMate helps you identify patterns, develop coping strategies, and build emotional resilience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Track Your Journey</h3>
            <p className="opacity-90 text-sm">
              Document emotions and experiences to understand patterns over time.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Get Support</h3>
            <p className="opacity-90 text-sm">
              Access AI-powered emotional support and practical coping strategies.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Build Resilience</h3>
            <p className="opacity-90 text-sm">
              Develop emotional strength through gratitude practices and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;