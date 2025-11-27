'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Model = 'claude' | 'gemini';

interface ModelContextType {
  model: Model;
  setModel: (model: Model) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [model, setModelState] = useState<Model>('gemini');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedModel') as Model | null;
    if (saved && (saved === 'claude' || saved === 'gemini')) {
      setModelState(saved);
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever model changes
  const setModel = (newModel: Model) => {
    setModelState(newModel);
    if (mounted) {
      localStorage.setItem('selectedModel', newModel);
    }
  };

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within ModelProvider');
  }
  return context;
}