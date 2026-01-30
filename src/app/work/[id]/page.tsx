"use client";

import { useLibraryStore } from '@/store/useLibraryStore';
import { useParams } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import ComicReader from '@/components/ComicReader';
import Link from 'next/link';

export default function WorkPage() {
  const { id } = useParams();
  const works = useLibraryStore((state) => state.works);
  
  // Derive work directly from store state during render
  // This avoids "setState in useEffect" errors entirely
  const work = works.find((w) => w.id === id) || null;

  // Handle case where store might be empty on direct refresh (since persistence isn't done yet)
  // In a real app, we would hydrate from IndexedDB here.
  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {works.length === 0 ? (
          <div className="text-center">
            <p className="mb-4">Library is empty (Persistence not implemented yet).</p>
            <Link href="/" className="text-pink-500 underline">Go back to Home to load mocks</Link>
          </div>
        ) : (
          <p>Work not found.</p>
        )}
      </div>
    );
  }

  if (work.type === 'video') {
    return <VideoPlayer work={work} />;
  }

  if (work.type === 'comic') {
    return <ComicReader work={work} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Unsupported media type: {work.type}
    </div>
  );
}
