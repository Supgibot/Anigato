import React, { useRef, useEffect } from 'react';
import { Work, Track } from '@/types/manifest';
import styles from './VideoPlayer.module.scss';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface VideoPlayerProps {
  work: Work;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ work }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Logic to pick the best source (naive for now: first raw media found)
  // In a real scenario, we'd let user select resolution/source
  const rawMediaKeys = work.raw_media ? Object.keys(work.raw_media) : [];
  const primaryKey = rawMediaKeys[0]; // e.g., "movie"
  const rawSources = work.raw_media?.[primaryKey];

  // Logic to find subtitles
  const subtitles = work.localizations?.[0]?.tracks?.[primaryKey]?.filter(t => t.type === 'subtitle') || [];

  if (!rawSources || !Array.isArray(rawSources) || rawSources.length === 0) {
    return <div className="text-white p-10">No video source found.</div>;
  }

  const activeSource = rawSources[0]; // Default to first source

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        <FaArrowLeft /> Back
      </Link>
      
      <div className={styles.playerWrapper}>
        <video 
          ref={videoRef} 
          className={styles.video} 
          controls 
          poster={work.cover_url}
          autoPlay
        >
          <source src={activeSource.url} type={`video/${activeSource.format}`} />
          
          {subtitles.map((sub, idx) => (
            <track 
              key={idx}
              kind="subtitles"
              label={sub.label}
              srcLang={sub.language}
              src={sub.url}
              default={idx === 0}
            />
          ))}
          
          Your browser does not support the video tag.
        </video>
      </div>

      <div className={styles.meta}>
        <h1>{work.original_title}</h1>
        <p>{work.description}</p>
        <div className={styles.sourceInfo}>
          Source: {activeSource.quality} ({activeSource.format})
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
