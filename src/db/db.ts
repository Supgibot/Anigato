import Dexie, { Table } from 'dexie';
import { Manifest, Work } from '@/types/manifest';

class AnigatoDatabase extends Dexie {
  manifests!: Table<Manifest, string>; // Primary key: maintainer + version (composite) or just url? Let's use url or generate uuid.
  works!: Table<Work, string>;

  constructor() {
    super('AnigatoDB');
    this.version(1).stores({
      manifests: '++id, maintainer, version', // id is auto-incremented
      works: 'id, type, original_title' // id is uuid
    });
  }
}

export const db = new AnigatoDatabase();
