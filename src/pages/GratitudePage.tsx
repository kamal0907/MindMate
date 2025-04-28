import React from 'react';
import GratitudeWall from '../components/gratitude/GratitudeWall';

const GratitudePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gratitude Wall</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <GratitudeWall />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">About Gratitude</h2>
            <p className="text-gray-600 mb-3">
              Practicing gratitude has been shown to significantly improve mental well-being. It helps shift focus from negative to positive aspects of life.
            </p>
            <p className="text-gray-600">
              Adding to your gratitude wall regularly can help build a habit of positive thinking.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Gratitude Prompts</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="p-2 bg-pink-50 rounded-md">Something that made you smile today</li>
              <li className="p-2 bg-pink-50 rounded-md">A person who has positively influenced you</li>
              <li className="p-2 bg-pink-50 rounded-md">A challenge you've overcome recently</li>
              <li className="p-2 bg-pink-50 rounded-md">Something in nature you appreciate</li>
              <li className="p-2 bg-pink-50 rounded-md">A simple pleasure you enjoy</li>
              <li className="p-2 bg-pink-50 rounded-md">Something you're looking forward to</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GratitudePage;