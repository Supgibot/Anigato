import React from 'react';
import { Work } from '@/types/manifest';
import styles from './WorkCard.module.scss';
import { FaPlayCircle, FaBookOpen, FaImages } from 'react-icons/fa';
import Link from 'next/link';

interface WorkCardProps {
  work: Work;
  onClick?: (work: Work) => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, onClick }) => {
  const getIcon = () => {
    switch (work.type) {
      case 'video': return <FaPlayCircle />;
      case 'comic': return <FaImages />;
      case 'book': return <FaBookOpen />;
      default: return <FaPlayCircle />;
    }
  };

  return (
    <Link href={`/work/${work.id}`} className="block h-full">
      <div 
        className={styles.card} 
        onClick={() => onClick?.(work)}
        role="button"
        tabIndex={0}
      >
        <div className={styles.imageContainer}>
          {work.cover_url ? (
            <img src={work.cover_url} alt={work.original_title} className={styles.image} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
              No Cover
            </div>
          )}
          
          <div className={styles.typeBadge}>{work.type}</div>
          
          <div className={styles.playOverlay}>
            {getIcon()}
          </div>

          <div className={styles.overlay}>
            <h3 className={styles.title}>{work.original_title}</h3>
            <div className={styles.meta}>
              {work.localizations?.[0]?.title && (
                <span className="opacity-75 truncate">{work.localizations[0].title}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkCard;
