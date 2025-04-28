import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { formatTime } from '../../utils/dateUtils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div
          className={`flex items-start justify-center h-8 w-8 rounded-full mt-1 ${
            isBot ? 'bg-blue-100 text-blue-600 mr-2' : 'bg-green-100 text-green-600 ml-2'
          }`}
        >
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>
        
        <div>
          <div
            className={`rounded-lg px-4 py-2 ${
              isBot
                ? 'bg-blue-50 text-gray-800 rounded-tl-none'
                : 'bg-blue-600 text-white rounded-tr-none'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          
          <div
            className={`text-xs text-gray-500 mt-1 ${
              isBot ? 'text-left' : 'text-right'
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;