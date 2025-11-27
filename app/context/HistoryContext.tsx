'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface RecipeHistoryItem {
  id: string;
  ingredients: string[];
  markdown: string;
  model: 'claude' | 'gemini';
  timestamp: number;
}

interface HistoryContextType {
  history: RecipeHistoryItem[];
  addRecipe: (recipe: Omit<RecipeHistoryItem, 'id' | 'timestamp'>) => void;
  deleteRecipe: (id: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<RecipeHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recipeHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse recipe history:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever history changes
  const addRecipe = (recipe: Omit<RecipeHistoryItem, 'id' | 'timestamp'>) => {
    const newRecipe: RecipeHistoryItem = {
      ...recipe,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updated = [newRecipe, ...history];
    setHistory(updated);
    if (mounted) {
      localStorage.setItem('recipeHistory', JSON.stringify(updated));
    }
  };

  const deleteRecipe = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    if (mounted) {
      localStorage.setItem('recipeHistory', JSON.stringify(updated));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (mounted) {
      localStorage.removeItem('recipeHistory');
    }
  };

  return (
    <HistoryContext.Provider value={{ history, addRecipe, deleteRecipe, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
}
