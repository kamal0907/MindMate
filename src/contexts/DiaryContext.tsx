import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getDiaryEntries, addDiaryEntry } from '../services/api';
import { DiaryEntry } from '../types';

interface DiaryContextType {
  entries: DiaryEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'date'>) => Promise<void>;
  refreshEntries: () => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType | null>(null);

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedEntries = await getDiaryEntries();
      setEntries(fetchedEntries);
      setError(null);
    } catch (err) {
      console.error('Error fetching diary entries:', err);
      setError('Failed to fetch diary entries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEntries();
  }, [user]);

  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'date'>) => {
    try {
      const updatedEntries = await addDiaryEntry(entry);
      setEntries(updatedEntries);
      setError(null);
    } catch (err) {
      console.error('Error adding diary entry:', err);
      setError('Failed to add diary entry. Please try again later.');
    }
  };

  return (
    <DiaryContext.Provider value={{ entries, loading, error, addEntry, refreshEntries }}>
      {children}
    </DiaryContext.Provider>
  );
}; 