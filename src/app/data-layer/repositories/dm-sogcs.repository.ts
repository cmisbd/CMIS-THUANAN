import { Injectable } from '@angular/core';
import { DmSoGcsStore } from '../indexeddb/dm-sogcs.store';

/**
 * Repository cho DM_SOGCS – dùng để giao tiếp giữa Component/Service và IndexedDB.
 */
@Injectable({ providedIn: 'root' })
export class DmSoGcsRepository {

  constructor(private store: DmSoGcsStore) {}

  saveMany(list: any[]): Promise<void> {
    return this.store.putMany(list);
  }

  saveOne(item: any): Promise<void> {
    return this.store.putOne(item);
  }

  getAll(): Promise<any[]> {
    return this.store.getAll();
  }

  getByMaSogcs(maSogcs: string): Promise<any | undefined> {
    return this.store.getByKey(maSogcs);
  }

  delete(maSogcs: string): Promise<void> {
    return this.store.delete(maSogcs);
  }

  clear(): Promise<void> {
    return this.store.clear();
  }
}
