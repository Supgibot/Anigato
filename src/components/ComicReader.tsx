import React, { useState } from 'react';
import { Work, RawMediaComicChapter } from '@/types/manifest';
import styles from './ComicReader.module.scss';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import SmartOverlay from './SmartOverlay';

interface ComicReaderProps {
  work: Work;
}

const ComicReader: React.FC<ComicReaderProps> = ({ work }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Logic to pick chapter (naive: first one found)
  const rawMediaKeys = work.raw_media ? Object.keys(work.raw_media) : [];
  const primaryKey = rawMediaKeys[0]; // e.g., "chapter_1"
  const chapter = work.raw_media?.[primaryKey] as RawMediaComicChapter;

  // Logic to find Overlay Script
  const overlayUrl = work.localizations?.[0]?.text_overlays?.[primaryKey];

  if (!chapter || !chapter.pages) {
    return <div className="text-white p-10">No comic pages found.</div>;
  }

  const pages = chapter.pages;
  const totalPages = pages.length;

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <FaArrowLeft />
        </Link>
        <div className={styles.title}>
          {work.original_title} <span className={styles.subtitle}>- {primaryKey.replace('_', ' ')}</span>
        </div>
        <div className={styles.pageIndicator}>
          Page {currentPageIndex + 1} / {totalPages}
        </div>
      </header>

      <div className={styles.viewer}>
        <div className={styles.pageWrapper} onClick={handleNext}>
          <div className="relative">
            <img 
              src={pages[currentPageIndex].url} 
              alt={`Page ${pages[currentPageIndex].page}`} 
              className={styles.pageImage}
            />
            {/* Inject Overlay here */}
            {overlayUrl && (
              <SmartOverlay 
                scriptUrl={overlayUrl} // In real app, resolve relative path properly
                pageNumber={currentPageIndex} 
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          onClick={handlePrev} 
          disabled={currentPageIndex === 0}
          className={styles.navBtn}
        >
          <FaChevronLeft /> Prev
        </button>

        <input 
          type="range" 
          min="0" 
          max={totalPages - 1} 
          value={currentPageIndex} 
          onChange={(e) => setCurrentPageIndex(parseInt(e.target.value))}
          className={styles.scrubber}
        />

        <button 
          onClick={handleNext} 
          disabled={currentPageIndex === totalPages - 1}
          className={styles.navBtn}
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ComicReader;
