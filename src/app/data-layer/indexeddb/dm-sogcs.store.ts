import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import {
  GcsOfflineDB,
  GCS_DB_NAME,
  GCS_DB_VERSION,
  GCS_STORE_NAMES
} from './db-config';

@Injectable({ providedIn: 'root' })
export class DmSoGcsStore {
  private dbPromise = openDB<GcsOfflineDB>(GCS_DB_NAME, GCS_DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(GCS_STORE_NAMES.DM_SOGCS)) {
        db.createObjectStore(GCS_STORE_NAMES.DM_SOGCS, {
          keyPath: 'MA_SOGCS'
        });
      }
    }
  });

  async putMany(list: any[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(GCS_STORE_NAMES.DM_SOGCS, 'readwrite');
    for (const item of list || []) {
      await tx.store.put(item);
    }
    await tx.done;
  }

  async putOne(item: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put(GCS_STORE_NAMES.DM_SOGCS, item);
  }

  async getAll(): Promise<any[]> {
    const db = await this.dbPromise;
    return db.getAll(GCS_STORE_NAMES.DM_SOGCS);
  }

  async getByKey(maSogcs: string): Promise<any | undefined> {
    const db = await this.dbPromise;
    return db.get(GCS_STORE_NAMES.DM_SOGCS, maSogcs);
  }

  async delete(maSogcs: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(GCS_STORE_NAMES.DM_SOGCS, maSogcs);
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(GCS_STORE_NAMES.DM_SOGCS);
  }
}
