import { Injectable } from '@angular/core';
import { DTramStore } from '../indexeddb/d-tram.store';

@Injectable({ providedIn: 'root' })
export class DTramRepository {

  constructor(private store: DTramStore) {}

  /**
   * Normalize data so that IndexedDB always receives:
   * MA_TRAM (key), TEN_TRAM
   */
  private normalize(item: any) {
    return {
      MA_TRAM: item.MA_TRAM ?? item.ma_tram,    // hỗ trợ cả hoa + thường
      TEN_TRAM: item.TEN_TRAM ?? item.ten_tram  // hỗ trợ cả hoa + thường
    };
  }

  saveMany(list: any[]): Promise<void> {
    const normalized = list.map(x => this.normalize(x));
    return this.store.putMany(normalized);
  }

  saveOne(item: any): Promise<void> {
    const normalized = this.normalize(item);
    return this.store.putOne(normalized);
  }

  getAll(): Promise<any[]> {
    return this.store.getAll();
  }

  getByMaTram(maTram: string): Promise<any | undefined> {
    return this.store.getByKey(maTram);
  }

  delete(maTram: string): Promise<void> {
    return this.store.delete(maTram);
  }

  clear(): Promise<void> {
    return this.store.clear();
  }
}
