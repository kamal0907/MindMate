import { getAuthToken } from '../utils/api';
import { DiaryEntry, GratitudeEntry, ChatMessage } from '../types';

const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error);
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

export const createUser = async () => {
  try {
    const token = await getAuthToken();
    console.log('Creating user with token:', token ? 'Token exists' : 'No token');
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const token = await getAuthToken();
    console.log('Getting user data with token:', token ? 'Token exists' : 'No token');
    
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Diary endpoints
export const getDiaryEntries = async (): Promise<DiaryEntry[]> => {
  try {
    const token = await getAuthToken();
    console.log('Getting diary entries with token:', token ? 'Token exists' : 'No token');
    
    const response = await fetch(`${API_URL}/users/diary`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting diary entries:', error);
    throw error;
  }
};

export const addDiaryEntry = async (entry: Omit<DiaryEntry, 'id' | 'date'>): Promise<DiaryEntry[]> => {
  try {
    const token = await getAuthToken();
    console.log('Adding diary entry with token:', token ? 'Token exists' : 'No token');
    console.log('Entry data:', entry);
    
    const response = await fetch(`${API_URL}/users/diary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding diary entry:', error);
    throw error;
  }
};

// Gratitude endpoints
export const getGratitudeEntries = async (): Promise<GratitudeEntry[]> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/users/gratitude`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting gratitude entries:', error);
    throw error;
  }
};

export const addGratitudeEntry = async (entry: Omit<GratitudeEntry, 'id' | 'date'>): Promise<GratitudeEntry[]> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/users/gratitude`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding gratitude entry:', error);
    throw error;
  }
};

// Chat endpoints
export const getChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/users/chat`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

export const addChatMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage[]> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/users/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding chat message:', error);
    throw error;
  }
}; 