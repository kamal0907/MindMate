import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DiaryEntry, 
  ChatMessage, 
  GratitudeEntry,
  EmotionType,
  CopingSuggestion
} from '../types';
import { 
  mockDiaryEntries, 
  mockChatMessages, 
  mockGratitudeEntries,
  getSuggestionsForEmotion
} from '../data/mockData';
import { analyzeEmotions, detectConcerningContent } from '../utils/emotionUtils';
import { getCurrentDateISOString } from '../utils/dateUtils';

interface AppContextType {
  // Diary state
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (content: string, isPublic: boolean) => void;
  updateDiaryEntry: (id: string, updates: Partial<DiaryEntry>) => void;
  deleteDiaryEntry: (id: string) => void;
  
  // Chat state
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => void;
  clearChat: () => void;
  
  // Gratitude state
  gratitudeEntries: GratitudeEntry[];
  addGratitudeEntry: (content: string) => void;
  deleteGratitudeEntry: (id: string) => void;
  
  // Emotion check-in
  dailyEmotion: EmotionType | null;
  setDailyEmotion: (emotion: EmotionType) => void;
  
  // Support suggestions
  getCopingSuggestions: (emotion: EmotionType) => CopingSuggestion[];
  
  // Emergency support
  showEmergencySupport: boolean;
  setShowEmergencySupport: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(mockDiaryEntries);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>(mockGratitudeEntries);
  const [dailyEmotion, setDailyEmotion] = useState<EmotionType | null>(null);
  const [showEmergencySupport, setShowEmergencySupport] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedDiaryEntries = localStorage.getItem('diaryEntries');
    const storedChatMessages = localStorage.getItem('chatMessages');
    const storedGratitudeEntries = localStorage.getItem('gratitudeEntries');
    const storedDailyEmotion = localStorage.getItem('dailyEmotion');

    if (storedDiaryEntries) setDiaryEntries(JSON.parse(storedDiaryEntries));
    if (storedChatMessages) setChatMessages(JSON.parse(storedChatMessages));
    if (storedGratitudeEntries) setGratitudeEntries(JSON.parse(storedGratitudeEntries));
    if (storedDailyEmotion) setDailyEmotion(JSON.parse(storedDailyEmotion));
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
  }, [gratitudeEntries]);

  useEffect(() => {
    localStorage.setItem('dailyEmotion', JSON.stringify(dailyEmotion));
  }, [dailyEmotion]);

  // Diary functions
  const addDiaryEntry = (content: string, isPublic: boolean) => {
    const emotions = analyzeEmotions(content).map(type => ({
      type,
      intensity: Math.floor(Math.random() * 5) + 5 // Random intensity between 5-10
    }));

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      content,
      date: getCurrentDateISOString(),
      emotions,
      isPublic
    };

    setDiaryEntries(prev => [newEntry, ...prev]);

    // Check for concerning content
    if (detectConcerningContent(content)) {
      setShowEmergencySupport(true);
    }
  };

  const updateDiaryEntry = (id: string, updates: Partial<DiaryEntry>) => {
    setDiaryEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Chat functions
  const sendChatMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: getCurrentDateISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Generate bot response (simple for now, would be replaced with actual AI)
    setTimeout(() => {
      const botResponse = generateBotResponse(content);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: botResponse,
        timestamp: getCurrentDateISOString()
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  // Simple bot response generation
  const generateBotResponse = (userMessage: string): string => {
    const lowercaseMsg = userMessage.toLowerCase();
    
    if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi ')) {
      return "Hello there! How are you feeling today?";
    }
    
    if (lowercaseMsg.includes('sad') || lowercaseMsg.includes('depressed') || lowercaseMsg.includes('unhappy')) {
      return "I'm sorry to hear you're feeling down. Would you like to talk about it or maybe try a mood-lifting activity?";
    }
    
    if (lowercaseMsg.includes('anxious') || lowercaseMsg.includes('nervous') || lowercaseMsg.includes('worried')) {
      return "It sounds like you're feeling anxious. Have you tried any breathing exercises? Taking slow, deep breaths can help calm your nervous system.";
    }
    
    if (lowercaseMsg.includes('angry') || lowercaseMsg.includes('mad') || lowercaseMsg.includes('frustrated')) {
      return "I can sense you're frustrated. Sometimes taking a short break or doing some physical activity can help release that tension.";
    }
    
    if (lowercaseMsg.includes('happy') || lowercaseMsg.includes('good') || lowercaseMsg.includes('great')) {
      return "I'm glad to hear you're feeling good! What's been bringing you joy lately?";
    }
    
    if (lowercaseMsg.includes('help') || lowercaseMsg.includes('suggestion')) {
      return "I'm here to help. You could try journaling, meditation, talking to a friend, or doing something you enjoy. What sounds most appealing right now?";
    }
    
    // Default response
    return "Thank you for sharing. Would you like to talk more about what's on your mind, or maybe try one of our mindfulness activities?";
  };

  const clearChat = () => {
    setChatMessages([{
      id: Date.now().toString(),
      sender: 'bot',
      content: 'Hello! I\'m MindMate, your mental wellness companion. How are you feeling today?',
      timestamp: getCurrentDateISOString()
    }]);
  };

  // Gratitude functions
  const addGratitudeEntry = (content: string) => {
    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      content,
      date: getCurrentDateISOString()
    };

    setGratitudeEntries(prev => [newEntry, ...prev]);
  };

  const deleteGratitudeEntry = (id: string) => {
    setGratitudeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Support suggestions
  const getCopingSuggestions = (emotion: EmotionType): CopingSuggestion[] => {
    return getSuggestionsForEmotion(emotion);
  };

  const value = {
    diaryEntries,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    chatMessages,
    sendChatMessage,
    clearChat,
    gratitudeEntries,
    addGratitudeEntry,
    deleteGratitudeEntry,
    dailyEmotion,
    setDailyEmotion,
    getCopingSuggestions,
    showEmergencySupport,
    setShowEmergencySupport
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};