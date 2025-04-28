import { authenticatedFetch, getAuthToken } from '../utils/api';
import { DiaryEntry, GratitudeEntry, ChatMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
    console.log('Creating user in database...');
    const response = await authenticatedFetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating user:', errorData);
      throw new Error(errorData.message || 'Failed to create user');
    }

    const userData = await response.json();
    console.log('User created successfully:', userData);
    return userData;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    console.log('Fetching user data...');
    const response = await authenticatedFetch(`${API_BASE_URL}/users/me`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching user data:', errorData);
      throw new Error(errorData.message || 'Failed to fetch user data');
    }

    const userData = await response.json();
    console.log('User data fetched successfully:', userData);
    return userData;
  } catch (error) {
    console.error('Error in getUserData:', error);
    throw error;
  }
};

// Diary endpoints
export const getDiaryEntries = async (): Promise<DiaryEntry[]> => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/users/diary`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting diary entries:', error);
    throw error;
  }
};

export const addDiaryEntry = async (entry: Omit<DiaryEntry, 'id' | 'date'>): Promise<DiaryEntry[]> => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/users/diary`, {
      method: 'POST',
      headers: {
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
    const response = await fetch(`${API_BASE_URL}/users/gratitude`, {
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
    const response = await fetch(`${API_BASE_URL}/users/gratitude`, {
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
    const response = await fetch(`${API_BASE_URL}/users/chat`, {
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
    const response = await fetch(`${API_BASE_URL}/users/chat`, {
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