import { EmotionType, DiaryEntry } from '../types';

/**
 * Emotion utility functions
 */

/**
 * Get color for emotion
 */
export const getEmotionColor = (emotion: EmotionType): string => {
  const colors: Record<EmotionType, string> = {
    happy: '#10B981', // Green
    excited: '#F59E0B', // Amber
    calm: '#60A5FA', // Light Blue
    grateful: '#8B5CF6', // Violet
    hopeful: '#EC4899', // Pink
    neutral: '#9CA3AF', // Gray
    sad: '#6B7280', // Gray
    anxious: '#FBBF24', // Yellow
    stressed: '#F97316', // Orange
    angry: '#EF4444', // Red
    overwhelmed: '#7C3AED', // Purple
  };

  return colors[emotion] || colors.neutral;
};

/**
 * Get emoji for emotion
 */
export const getEmotionEmoji = (emotion: EmotionType): string => {
  const emojis: Record<EmotionType, string> = {
    happy: '😊',
    excited: '🤩',
    calm: '😌',
    grateful: '🙏',
    hopeful: '🌱',
    neutral: '😐',
    sad: '😔',
    anxious: '😰',
    stressed: '😫',
    angry: '😠',
    overwhelmed: '🥴',
  };

  return emojis[emotion] || emojis.neutral;
};

/**
 * Simple sentiment analysis to detect emotions from text
 */
export const analyzeEmotions = (text: string): EmotionType[] => {
  const emotions: EmotionType[] = [];
  const lowercaseText = text.toLowerCase();
  
  // Simple keyword matching
  const emotionKeywords: Record<EmotionType, string[]> = {
    happy: ['happy', 'joy', 'glad', 'delighted', 'wonderful', 'great'],
    excited: ['excited', 'thrilled', 'enthusiastic', 'eager', 'pumped'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude'],
    hopeful: ['hopeful', 'optimistic', 'looking forward', 'positive'],
    neutral: ['okay', 'fine', 'neutral', 'average'],
    sad: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'upset', 'miserable'],
    anxious: ['anxious', 'worried', 'nervous', 'uneasy', 'fear', 'scared'],
    stressed: ['stressed', 'pressure', 'overwhelm', 'burden', 'tension'],
    angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated'],
    overwhelmed: ['overwhelmed', 'too much', 'cannot handle', 'drowning']
  };
  
  // Check for emotional keywords
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      emotions.push(emotion as EmotionType);
    }
  });
  
  // Default to neutral if no emotions detected
  if (emotions.length === 0) {
    emotions.push('neutral');
  }
  
  return emotions;
};

/**
 * Detect potentially concerning content that might need support
 */
export const detectConcerningContent = (text: string): boolean => {
  const concerningKeywords = [
    'suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself',
    'hopeless', 'no reason to live', 'better off dead', 'can\'t go on'
  ];
  
  const lowercaseText = text.toLowerCase();
  return concerningKeywords.some(keyword => lowercaseText.includes(keyword));
};

/**
 * Get dominant emotion from a list of emotions
 */
export const getDominantEmotion = (emotions: EmotionType[]): EmotionType => {
  if (emotions.length === 0) return 'neutral';
  
  const counts: Record<EmotionType, number> = {} as Record<EmotionType, number>;
  
  emotions.forEach(emotion => {
    counts[emotion] = (counts[emotion] || 0) + 1;
  });
  
  let maxCount = 0;
  let dominant: EmotionType = 'neutral';
  
  Object.entries(counts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominant = emotion as EmotionType;
    }
  });
  
  return dominant;
};

/**
 * Calculate emotion frequencies from diary entries
 */
export const calculateEmotionFrequencies = (entries: DiaryEntry[]) => {
  const frequencies: Record<EmotionType, number> = {
    happy: 0,
    excited: 0,
    calm: 0,
    grateful: 0,
    hopeful: 0,
    neutral: 0,
    sad: 0,
    anxious: 0,
    stressed: 0,
    angry: 0,
    overwhelmed: 0
  };
  
  entries.forEach(entry => {
    entry.emotions.forEach(emotion => {
      frequencies[emotion.type] += 1;
    });
  });
  
  return Object.entries(frequencies).map(([emotion, count]) => ({
    emotion: emotion as EmotionType,
    count
  }));
};