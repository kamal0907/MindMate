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
    if (!user) {
      console.log('No user found, skipping diary entries fetch');
      setEntries([]);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      const fetchedEntries = await getDiaryEntries();
      // Convert date strings to Date objects
      const processedEntries = fetchedEntries.map(entry => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setEntries(processedEntries);
      setError(null);
    } catch (err) {
      console.error('Error fetching diary entries:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch diary entries. Please try again later.');
      } else {
        setError('Failed to fetch diary entries. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEntries();
  }, [user]);

  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'date'>) => {
    if (!user) {
      throw new Error('User must be authenticated to add diary entries');
    }

    try {
      const updatedEntries = await addDiaryEntry(entry);
      // Convert date strings to Date objects
      const processedEntries = updatedEntries.map(entry => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setEntries(processedEntries);
      setError(null);
    } catch (err) {
      console.error('Error adding diary entry:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to add diary entry. Please try again later.');
      } else {
        setError('Failed to add diary entry. Please try again later.');
      }
      throw err;
    }
  };

  return (
    <DiaryContext.Provider value={{ entries, loading, error, addEntry, refreshEntries }}>
      {children}
    </DiaryContext.Provider>
  );
}; 