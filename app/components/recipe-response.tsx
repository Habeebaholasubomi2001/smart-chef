'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface RecipeResponseProps {
  markdown: string;
  fallback: boolean;
  isLoading: boolean;
}

export default function RecipeResponse({
  markdown,
  fallback,
  isLoading,
}: RecipeResponseProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    alert('Recipe copied to clipboard!');
  };

  const downloadAsMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'recipe.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-800">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin text-4xl mb-4">🍳</div>
            <p className="text-gray-600 dark:text-gray-400">
              Generating your recipe...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-800">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Enter ingredients and click "Get Recipe" to see a suggestion here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-800">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recipe
        </h2>
        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            className="text-sm px-3 py-2 bg-yellow-green-500 hover:bg-yellow-green-600 text-white rounded-lg transition-colors dark:bg-yellow-green-600 dark:hover:bg-yellow-green-700"
            title="Copy recipe to clipboard"
          >
            📋 Copy
          </button>
          <button
            onClick={downloadAsMarkdown}
            className="text-sm px-3 py-2 bg-yellow-green-500 hover:bg-yellow-green-600 text-white rounded-lg transition-colors dark:bg-yellow-green-600 dark:hover:bg-yellow-green-700"
            title="Download recipe as markdown"
          >
            ⬇️ Download
          </button>
        </div>
      </div>

      {/* Fallback Notice */}
      {fallback && (
        <div className="mb-4 p-3 bg-yellow-green-50 border border-yellow-green-200 rounded-lg dark:bg-yellow-green-900/20 dark:border-yellow-green-700">
          <p className="text-sm text-yellow-green-800 dark:text-yellow-green-300">
            ⚠️ Using a sample recipe. API may be unavailable. Try again later or check your API keys.
          </p>
        </div>
      )}

      {/* Markdown Content */}
      <div
        className="prose dark:prose-invert prose-sm sm:prose-base max-w-none"
        aria-live="polite"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold text-yellow-green-600 dark:text-yellow-green-400 mb-4 mt-6" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-xl font-bold text-yellow-green-600 dark:text-yellow-green-400 mb-3 mt-5" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-4" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-gray-700 dark:text-gray-300" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
            ),
            code: ({ node, inline, ...props }) => (
              inline ? (
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-900 dark:text-gray-100 font-mono" {...props} />
              ) : (
                <code className="block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100 font-mono mb-4" {...props} />
              )
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-yellow-green-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-yellow-green-600 dark:text-yellow-green-400 hover:underline" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-2 text-left font-semibold" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-gray-300 dark:border-gray-600 p-2" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}