import { 
  DiaryEntry, 
  ChatMessage, 
  GratitudeEntry,
  CopingSuggestion,
  EmotionType 
} from '../types';
import { getCurrentDateISOString } from '../utils/dateUtils';

// Mock diary entries
export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: '1',
    content: 'Today I felt really good about my presentation at work. My boss was impressed and that made me happy and excited for future projects.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    emotions: [
      { type: 'happy', intensity: 8 },
      { type: 'excited', intensity: 7 }
    ],
    isPublic: true
  },
  {
    id: '2',
    content: 'Feeling a bit anxious about tomorrow\'s deadline. I\'m not sure if I\'ll be able to finish everything in time. Need to focus and maybe get some help.',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    emotions: [
      { type: 'anxious', intensity: 6 },
      { type: 'stressed', intensity: 5 }
    ],
    isPublic: false
  },
  {
    id: '3',
    content: 'Had a great day at the park with friends. The weather was perfect and I felt really peaceful and relaxed for the first time in weeks.',
    date: getCurrentDateISOString(),
    emotions: [
      { type: 'calm', intensity: 9 },
      { type: 'happy', intensity: 7 }
    ],
    isPublic: true
  },
  {
    id: '4',
    content: 'Missing my family today. It\'s been months since I last saw them in person. Feeling a bit down but hopeful we can meet soon.',
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    emotions: [
      { type: 'sad', intensity: 5 },
      { type: 'hopeful', intensity: 4 }
    ],
    isPublic: false
  },
  {
    id: '5',
    content: 'So grateful for the support I received from my friends when I needed it most. It means everything to know people care.',
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    emotions: [
      { type: 'grateful', intensity: 9 },
      { type: 'happy', intensity: 6 }
    ],
    isPublic: true
  }
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'bot',
    content: 'Hello! I\'m MindMate, your mental wellness companion. How are you feeling today?',
    timestamp: new Date(Date.now() - 60000).toISOString() // 1 minute ago
  },
  {
    id: '2',
    sender: 'user',
    content: 'I\'m feeling a bit stressed about work',
    timestamp: new Date(Date.now() - 30000).toISOString() // 30 seconds ago
  },
  {
    id: '3',
    sender: 'bot',
    content: 'I understand work can be stressful. Would you like to tell me more about what\'s causing your stress, or would you prefer some quick stress relief exercises?',
    timestamp: new Date(Date.now() - 15000).toISOString() // 15 seconds ago
  }
];

// Mock gratitude entries
export const mockGratitudeEntries: GratitudeEntry[] = [
  {
    id: '1',
    content: 'I\'m grateful for my supportive friends who always listen.',
    date: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: '2',
    content: 'Thankful for a warm home and good food.',
    date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '3',
    content: 'Appreciating the beautiful weather and sunshine today.',
    date: getCurrentDateISOString()
  }
];

// Mock coping suggestions
export const mockCopingSuggestions: CopingSuggestion[] = [
  {
    id: '1',
    type: 'breathing',
    content: '4-7-8 Breathing: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.',
    forEmotions: ['anxious', 'stressed', 'overwhelmed', 'angry']
  },
  {
    id: '2',
    type: 'quote',
    content: '"You are not your emotions, but you do need to honor them." - Tara Brach',
    forEmotions: ['sad', 'anxious', 'overwhelmed']
  },
  {
    id: '3',
    type: 'video',
    content: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
    forEmotions: ['anxious', 'stressed', 'overwhelmed']
  },
  {
    id: '4',
    type: 'activity',
    content: 'Try a 10-minute mindful walk outside, focusing on what you see, hear, and feel.',
    forEmotions: ['stressed', 'anxious', 'sad', 'angry']
  },
  {
    id: '5',
    type: 'quote',
    content: '"Happiness is not something ready-made. It comes from your own actions." - Dalai Lama',
    forEmotions: ['sad', 'neutral', 'hopeful']
  },
  {
    id: '6',
    type: 'breathing',
    content: 'Box Breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat.',
    forEmotions: ['anxious', 'stressed', 'angry']
  },
  {
    id: '7',
    type: 'video',
    content: 'https://www.youtube.com/watch?v=SEfs5TJZ6Nk',
    forEmotions: ['sad', 'neutral', 'hopeful']
  },
  {
    id: '8',
    type: 'activity',
    content: 'Write down three things you\'re grateful for right now.',
    forEmotions: ['sad', 'neutral', 'angry', 'hopeful']
  }
];

// Get suggestions for a specific emotion
export const getSuggestionsForEmotion = (emotion: EmotionType) => {
  // This will be replaced with API calls to get suggestions from the backend
  return [];
};

// Emergency support resources
export const emergencyResources = {
  hotlines: [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '1-800-273-8255',
      available: '24/7'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      available: '24/7'
    }
  ],
  message: 'If you\'re experiencing thoughts of harming yourself or others, please reach out for help immediately. You\'re not alone and support is available.'
};