// Common Types
export interface User {
  id: string;
  name: string;
}

// Diary Types
export interface DiaryEntry {
  id: string;
  content: string;
  date: Date;
  emotions: {
    type: EmotionType;
    intensity: number;
  }[];
  isPublic: boolean;
}

export interface Emotion {
  type: EmotionType;
  intensity: number; // 1-10
}

export type EmotionType = 
  | 'happy'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'calm'
  | 'excited'
  | 'grateful'
  | 'hopeful';

// Chatbot Types
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

// Gratitude Types
export interface GratitudeEntry {
  id: string;
  content: string;
  date: Date;
}

// Dashboard Types
export interface MoodData {
  date: string;
  emotion: EmotionType;
  intensity: number;
}

export interface EmotionFrequency {
  emotion: EmotionType;
  count: number;
}

// Support Types
export interface CopingSuggestion {
  id: string;
  type: 'breathing' | 'quote' | 'video' | 'activity';
  content: string;
  forEmotions: EmotionType[];
}