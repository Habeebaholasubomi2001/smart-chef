'use client';

import { useState, useRef } from 'react';

interface RecipeFormProps {
  onSubmit: (ingredients: string[]) => void;
  isLoading: boolean;
}

export default function RecipeForm({ onSubmit, isLoading }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Shift+Enter inserts a newline (default behavior)
  };

  const handleSubmit = () => {
    const trimmed = ingredients.trim();
    if (!trimmed) {
      alert('Please enter at least one ingredient');
      return;
    }

    // Split by comma or newline and clean up
    const ingredientsList = trimmed
      .split(/[,\n]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    onSubmit(ingredientsList);
    setIngredients(''); // Clear the textarea
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-800 h-fit">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Enter Your Ingredients
      </h2>

      <div className="mb-4">
        <label
          htmlFor="ingredients"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Ingredients
        </label>
        <textarea
          ref={textareaRef}
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter ingredients separated by commas or newlines. Example:&#10;Chicken, tomato, garlic"
          className="w-full h-40 p-3 border border-yellow-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 dark:bg-zinc-700 dark:border-yellow-green-600 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-green-500 resize-none"
          aria-describedby="ingredients-hint"
          disabled={isLoading}
        />
        <p
          id="ingredients-hint"
          className="text-xs text-gray-500 dark:text-gray-400 mt-2"
        >
          💡 Press <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">Enter</kbd> to submit or <kbd className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">Shift+Enter</kbd> for a new line
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-yellow-green-500 hover:bg-yellow-green-600 disabled:bg-yellow-green-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors dark:bg-yellow-green-600 dark:hover:bg-yellow-green-700 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            Generating Recipe...
          </>
        ) : (
          'Get Recipe'
        )}
      </button>
    </div>
  );
}