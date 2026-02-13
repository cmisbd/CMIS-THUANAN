import { openDB } from 'idb';
import { 
  GCS_DB_NAME, 
  GCS_DB_VERSION, 
  GCS_STORE_NAMES 
} from './gcs-constants';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CusLocationStore {
  
  private dbPromise = openDB(GCS_DB_NAME, GCS_DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(GCS_STORE_NAMES.CUSLOCATION)) {
        db.createObjectStore(GCS_STORE_NAMES.CUSLOCATION, {
          keyPath: 'CUSTOMEID'
        });
      }
    }
  });

  private storeName = GCS_STORE_NAMES.CUSLOCATION;


  // ⭐ Lấy 1 bản ghi theo CUSTOMEID (key)
  async getByKey(customeId: string): Promise<any | undefined> {
    const db = await this.dbPromise;
    return await db.get(this.storeName, customeId);
  }

  // ⭐ Xóa 1 bản ghi theo CUSTOMEID
  async delete(customeId: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(this.storeName, customeId);
  }

  // ⭐ Lấy tất cả bản ghi
  async getAll(): Promise<any[]> {
    const db = await this.dbPromise;
    return await db.getAll(this.storeName);
  }

  // ⭐ Lưu 1 bản ghi
  async putOne(item: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put(this.storeName, item);
  }

  // ⭐ Lưu nhiều bản ghi
  async putMany(items: any[]): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readwrite');

    for (const item of items) {
      await tx.store.put(item);
    }

    await tx.done;
  }

  // ⭐ Xóa hết dữ liệu
  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(this.storeName);
  }
}
