"use client";

import { useEffect, useState } from 'react';
import { useLibraryStore } from '@/store/useLibraryStore';
import WorkCard from '@/components/WorkCard';
import mockComic from '@/mocks/example-comic.json';
import mockVideo from '@/mocks/example-video.json';
import { Manifest } from '@/types/manifest';

// Import CSS module if needed, or inline styles for simplicity in page.tsx
// Using inline/global classes for layout structure here.

export default function Home() {
  const { works, addManifest, loadManifestFromUrl, isLoading, error, init } = useLibraryStore();
  const [urlInput, setUrlInput] = useState('');

  // Init DB on mount
  useEffect(() => {
    init();
  }, [init]);

  // Load mocks ONLY if DB is empty after init
  useEffect(() => {
    if (!isLoading && works.length === 0) {
      addManifest(mockComic as unknown as Manifest);
      addManifest(mockVideo as unknown as Manifest);
    }
  }, [isLoading, works.length, addManifest]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      await loadManifestFromUrl(urlInput);
      setUrlInput('');
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Anigato</h1>
          <p className="text-gray-400">Decentralized Multimedia Player</p>
        </div>

        <form onSubmit={handleImport} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Paste manifest URL..."
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-pink-500 w-full md:w-64"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Loading...' : 'Import'}
          </button>
        </form>
      </header>

      {error && (
        <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded mb-8">
          Error: {error}
        </div>
      )}

      {works.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">Your library is empty.</p>
          <p className="mt-2">Import a manifest JSON to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {works.map((work) => (
            <WorkCard 
              key={work.id} 
              work={work} 
              onClick={(w) => console.log('Clicked work:', w.original_title)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
