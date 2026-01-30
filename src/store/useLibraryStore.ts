import { create } from 'zustand';
import { Manifest, Work } from '@/types/manifest';
import { db } from '@/db/db';

interface LibraryState {
  manifests: Manifest[];
  works: Work[];
  isLoading: boolean;
  error: string | null;

  // Actions
  init: () => Promise<void>;
  addManifest: (manifest: Manifest) => Promise<void>;
  loadManifestFromUrl: (url: string) => Promise<void>;
  clearLibrary: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  manifests: [],
  works: [],
  isLoading: true, // Start loading to check DB
  error: null,

  init: async () => {
    try {
      const works = await db.works.toArray();
      const manifests = await db.manifests.toArray();
      set({ works, manifests, isLoading: false });
    } catch (err) {
      console.error('Failed to load DB', err);
      set({ isLoading: false });
    }
  },

  addManifest: async (manifest) => {
    // 1. Check duplication (simple check)
    const exists = await db.manifests
      .where({ maintainer: manifest.maintainer, version: manifest.version })
      .first();
    
    if (exists) return;

    // 2. Add to DB
    await db.transaction('rw', db.manifests, db.works, async () => {
      await db.manifests.add(manifest);
      await db.works.bulkPut(manifest.works); // bulkPut updates if id exists
    });

    // 3. Update State
    const allWorks = await db.works.toArray();
    const allManifests = await db.manifests.toArray();
    
    set({ works: allWorks, manifests: allManifests });
  },

  loadManifestFromUrl: async (url) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch manifest: ${response.statusText}`);
      
      const data = await response.json();
      // TODO: Validate Zod here
      
      await get().addManifest(data as Manifest);
      set({ isLoading: false });
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Unknown error loading manifest' 
      });
    }
  },

  clearLibrary: async () => {
    await db.works.clear();
    await db.manifests.clear();
    set({ works: [], manifests: [], error: null });
  },
}));
