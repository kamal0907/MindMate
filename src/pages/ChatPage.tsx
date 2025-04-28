import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Chat with MindMate</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ChatInterface />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">About MindMate Chat</h2>
            <p className="text-gray-600 mb-3">
              MindMate is an AI companion that offers emotional support and guidance. You can share your thoughts and feelings in a safe, non-judgmental space.
            </p>
            <p className="text-gray-600">
              Your conversations are private and secure.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Conversation Starters</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="p-2 bg-blue-50 rounded-md">"I'm feeling anxious about..."</li>
              <li className="p-2 bg-blue-50 rounded-md">"Today was a good day because..."</li>
              <li className="p-2 bg-blue-50 rounded-md">"I'm struggling with..."</li>
              <li className="p-2 bg-blue-50 rounded-md">"What are some ways to manage stress?"</li>
              <li className="p-2 bg-blue-50 rounded-md">"I need advice about..."</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;