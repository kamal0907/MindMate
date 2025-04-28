import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import ChatMessage from './ChatMessage';

const ChatInterface: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChat } = useAppContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim().length === 0) return;
    
    sendChatMessage(message);
    setMessage('');
    setIsTyping(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="font-semibold">Chat with MindMate</h2>
        <button
          onClick={clearChat}
          className="p-1.5 rounded-full text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
          title="Start new conversation"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <div className="bg-gray-200 rounded-full p-2 flex items-center justify-center h-8 w-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
            <p>MindMate is typing...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={message.trim().length === 0}
            className={`p-3 rounded-r-lg ${
              message.trim().length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors`}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;