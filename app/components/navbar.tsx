'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useModel } from '../context/ModelContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { model: selectedModel, setModel } = useModel();

  return (
    <nav className="bg-white shadow-md dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-yellow-green-600 dark:text-yellow-green-400">
              Smart Chef
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/history" 
              className="text-gray-700 hover:text-yellow-green-600 dark:text-gray-300 dark:hover:text-yellow-green-400 transition-colors"
            >
              History
            </Link>
            <Link 
              href="/favourites" 
              className="text-gray-700 hover:text-yellow-green-600 dark:text-gray-300 dark:hover:text-yellow-green-400 transition-colors"
            >
              Favourites
            </Link>

            {/* Model Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Model:</span>
              <select 
                value={selectedModel}
                onChange={(e) => setModel(e.target.value as 'claude' | 'gemini')}
                className="px-3 py-2 border border-yellow-green-300 rounded-lg bg-white text-gray-700 dark:bg-zinc-800 dark:border-yellow-green-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-green-500"
              >
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-yellow-green-100 dark:hover:bg-yellow-green-900 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/history" 
              className="block px-3 py-2 text-gray-700 hover:bg-yellow-green-100 dark:text-gray-300 dark:hover:bg-yellow-green-900 rounded-lg transition-colors"
            >
              History
            </Link>
            <Link 
              href="/favourites" 
              className="block px-3 py-2 text-gray-700 hover:bg-yellow-green-100 dark:text-gray-300 dark:hover:bg-yellow-green-900 rounded-lg transition-colors"
            >
              Favourites
            </Link>

            {/* Mobile Model Selector */}
            <div className="px-3 py-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Select Model:
              </label>
              <select 
                value={selectedModel}
                onChange={(e) => setModel(e.target.value as 'claude' | 'gemini')}
                className="w-full px-3 py-2 border border-yellow-green-300 rounded-lg bg-white text-gray-700 dark:bg-zinc-800 dark:border-yellow-green-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-green-500"
              >
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}