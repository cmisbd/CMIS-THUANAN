import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { GCS_DB_NAME, GCS_DB_VERSION, GcsOfflineDB } from '../indexeddb/db-config';
import { openGcsDb } from '../indexeddb/db-config';

@Injectable({
  providedIn: 'root'
})
export class DTramStore {

  //private dbPromise = openDB<GcsOfflineDB>(GCS_DB_NAME, GCS_DB_VERSION);
  private dbPromise = openGcsDb();
  // =====================
  // HÀM MỚI
  // =====================

  async save(item: any): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('d_tram', 'readwrite');
    await tx.store.put(item);
    await tx.done;
  }

  async bulkSave(list: any[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('d_tram', 'readwrite');
    for (const item of list) await tx.store.put(item);
    await tx.done;
  }

  async getAll(): Promise<any[]> {
    const db = await this.dbPromise;
    return db.getAll('d_tram');
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('d_tram', 'readwrite');
    await tx.store.clear();
    await tx.done;
  }

  // =====================
  // WRAPPER HÀM CŨ – ĐỂ KHÔNG LÀM LỖI REPOSITORY
  // =====================

  // putMany → bulkSave
putMany(list: any[]) {
  return this.bulkSave(list);
}

// putOne → save
putOne(item: any) {
  return this.save(item);
}

// getByKey → get
async getByKey(maTram: string) {
  const db = await this.dbPromise;
  return db.get('d_tram', maTram);
}

// delete → remove
delete(maTram: string) {
  return this.remove(maTram);
}

  async remove(maTram: string) {
    const db = await this.dbPromise;
    const tx = db.transaction('d_tram', 'readwrite');
    await tx.store.delete(maTram);
    await tx.done;
  }
  async get(maTram: string) {
    const db = await this.dbPromise;
    return db.get('d_tram', maTram);
  }
}
