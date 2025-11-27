'use client';

import { useHistory } from '../context/HistoryContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function HistoryClient() {
  const { history, deleteRecipe, clearHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Recipe History
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md dark:bg-zinc-800 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No recipes in history yet. Generate some recipes to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recipe History
        </h1>
        <button
          onClick={() => {
            if (
              confirm('Are you sure you want to clear all recipe history?')
            ) {
              clearHistory();
            }
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-800"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold px-3 py-1 bg-yellow-green-100 text-yellow-green-800 rounded-full dark:bg-yellow-green-900/30 dark:text-yellow-green-300">
                    {item.model}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString()} at{' '}
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ingredients: {item.ingredients.join(', ')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Delete this recipe from history?')) {
                    deleteRecipe(item.id);
                  }
                }}
                className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                🗑️ Delete
              </button>
            </div>

            {/* Recipe Content */}
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-yellow-green-600 dark:text-yellow-green-400 mb-4 mt-6"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-bold text-yellow-green-600 dark:text-yellow-green-400 mb-3 mt-5"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-4"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-700 dark:text-gray-300" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"
                      {...props}
                    />
                  ),
                  code: (props: any) =>
                    props.inline ? (
                      <code
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-900 dark:text-gray-100 font-mono"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100 font-mono mb-4"
                        {...props}
                      />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre
                      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto mb-4"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-yellow-green-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-yellow-green-600 dark:text-yellow-green-400 hover:underline"
                      {...props}
                    />
                  ),
                }}
              >
                {item.markdown}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
