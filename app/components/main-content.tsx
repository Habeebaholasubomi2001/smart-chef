'use client';

import { useState, useRef } from 'react';
import { useModel } from '../context/ModelContext';
import { useHistory } from '../context/HistoryContext';
import RecipeForm from './recipe-form';
import RecipeResponse from './recipe-response';

export default function MainContent() {
  const [markdown, setMarkdown] = useState('');
  const [fallback, setFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { model } = useModel();
  const { addRecipe } = useHistory();
  const responseRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (ingredients: string[]) => {
    setIsLoading(true);
    setError(null);
    setMarkdown('');
    setFallback(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const data = await response.json();
      setMarkdown(data.markdown);
      setFallback(data.fallback || false);

      // Save to history if successful (not fallback)
      if (!data.fallback) {
        addRecipe({
          ingredients,
          markdown: data.markdown,
          model,
        });
      }

      // Scroll to response and announce
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMsg);
      console.error('Error generating recipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
          <p className="text-sm text-red-800 dark:text-red-300">
            ❌ {error}
          </p>
        </div>
      )}

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Column - 1/3 on desktop, full on mobile */}
        <div className="md:col-span-1">
          <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Response Column - 2/3 on desktop, full on mobile */}
        <div className="md:col-span-2" ref={responseRef}>
          <RecipeResponse
            markdown={markdown}
            fallback={fallback}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}