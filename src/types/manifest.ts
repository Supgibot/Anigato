// src/types/manifest.ts

/**
 * Universal ID Map to link content across different manifests
 */
export interface ExternalIds {
  imdb?: string;
  mal?: number; // MyAnimeList
  anilist?: number;
  kitsu?: number;
  isbn?: string; // Books
  [key: string]: string | number | undefined;
}

/**
 * Supported media types
 */
export type WorkType = 'video' | 'comic' | 'book';

/**
 * A Track represents a localized layer (subtitle, audio dub, script)
 */
export interface Track {
  url: string;
  type: 'subtitle' | 'audio' | 'script';
  label: string; // e.g., "Portuguese (Brazil)", "English Commentary"
  language: string; // ISO code: pt-BR, en-US
}

/**
 * Text Overlay specific for Comics (Smart Reader)
 */
export interface ComicScript {
  version: string;
  pages: {
    pageNumber: number;
    balloons: {
      id: string;
      text: string;
      x: number; // Percentage or Pixel? (To be decided, usually %)
      y: number;
      width?: number;
      height?: number;
      style?: 'speech' | 'thought' | 'shout' | 'caption';
    }[];
  }[];
}

/**
 * Raw Media Resources (Clean/Original Files)
 */
export interface RawMediaVideo {
  quality: string; // 1080p, 720p
  url: string;
  format: 'mp4' | 'webm' | 'mkv';
}

export interface RawMediaComicPage {
  page: number;
  url: string;
  width?: number;
  height?: number;
}

export interface RawMediaComicChapter {
  title?: string;
  pages: RawMediaComicPage[];
}

/**
 * The Work Entity (Movie, Series, Book, Manga)
 */
export interface Work {
  id: string; // Internal UUID in this manifest
  external_ids: ExternalIds;
  original_title: string;
  cover_url?: string;
  description?: string;
  type: WorkType;

  // Raw Content (Agnostic of Language)
  raw_media?: {
    // For Video: key is usually "movie" or "episode_1"
    // For Comic: key is "chapter_1", "vol_1"
    [key: string]: RawMediaVideo[] | RawMediaComicChapter; 
  };

  // Localized Layers
  localizations?: {
    locale: string; // pt-BR
    title?: string; // Localized title
    description?: string;
    tracks?: {
      [key: string]: Track[]; // key matches raw_media key (e.g. "episode_1")
    };
    text_overlays?: {
      [key: string]: string; // URL to ComicScript JSON
    };
  }[];
}

/**
 * The Root Manifest File
 */
export interface Manifest {
  version: string;
  maintainer: string;
  last_updated: string;
  works: Work[];
}
