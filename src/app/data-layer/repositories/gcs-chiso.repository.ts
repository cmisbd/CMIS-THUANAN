import { Injectable } from '@angular/core';
import { GcsChisoStore } from '../indexeddb/gcs-chiso.store';

@Injectable({ providedIn: 'root' })
export class GcsChisoRepository {

  constructor(private store: GcsChisoStore) {}

  saveMany(list: any[]): Promise<void> {
    return this.store.putMany(list);
  }

  saveOne(item: any): Promise<void> {
    return this.store.putOne(item);
  }

  getAll(): Promise<any[]> {
    return this.store.getAll();
  }

  getByMaKhang(maKhang: string): Promise<any | undefined> {
    return this.store.getByKey(maKhang);
  }

  delete(maKhang: string): Promise<void> {
    return this.store.delete(maKhang);
  }

  clear(): Promise<void> {
    return this.store.clear();
  }
}
