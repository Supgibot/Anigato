// src/components/SmartOverlay.tsx
import React, { useEffect, useState } from 'react';
import { ComicScript } from '@/types/manifest';

interface SmartOverlayProps {
  scriptUrl?: string; // URL to the JSON script
  pageNumber: number; // Current page (1-based index usually, but let's match array 0-based internally if needed)
}

// Temporary internal type matching our mock structure roughly
interface MockScriptPage {
  pageNumber: number;
  balloons: {
    id: string;
    text: string;
    x: number; // Percent 0-100
    y: number; // Percent 0-100
    width?: number; // Percent
    style?: string;
  }[];
}

const SmartOverlay: React.FC<SmartOverlayProps> = ({ scriptUrl, pageNumber }) => {
  const [scriptData, setScriptData] = useState<MockScriptPage[] | null>(null);

  useEffect(() => {
    if (!scriptUrl) return;

    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => setScriptData(data))
      .catch(err => console.error("Failed to load script overlay", err));
  }, [scriptUrl]);

  if (!scriptData) return null;

  // Find balloons for current page (assuming mock uses 1-based pageNumber)
  const pageData = scriptData.find(p => p.pageNumber === pageNumber + 1); // +1 because we pass 0-based index from Reader

  if (!pageData) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pageData.balloons.map(balloon => (
        <div
          key={balloon.id}
          className="absolute bg-white text-black p-3 rounded-2xl text-center flex items-center justify-center shadow-lg border-2 border-black"
          style={{
            left: `${balloon.x}%`,
            top: `${balloon.y}%`,
            width: balloon.width ? `${balloon.width}%` : 'auto',
            transform: 'translate(-50%, -50%)', // Center on coordinate
            fontSize: 'clamp(10px, 1.5vw, 18px)', // Responsive text
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            pointerEvents: 'auto', // Allow text selection
            cursor: 'text'
          }}
        >
          {balloon.text}
        </div>
      ))}
    </div>
  );
};

export default SmartOverlay;
