import Dexie from 'dexie';
import { Injectable } from '@angular/core';

// ====== MODELS ======
export interface SoGCS {
  bookCode: string;   // keyPath trong IndexedDB
  ma_sogcs: string;   // mã sổ từ API thật
}

export interface KhachHangGCS {
  customerId: string;
  customerCode: string;
  customerName: string;
  address?: string;
  bookCode: string;
  lat?: number | null;
  lng?: number | null;
  meterIndex?: number | null;

  // Dùng cho UI
  checked?: boolean;
}

export interface PendingUpdate {
  id?: number;              // auto-increment
  customerId: string;
  actionType: string;       // 'update-location'
  payload: any;             // object gửi lên API
  synced: number;           // 0 = chưa sync, 1 = đã sync
  createdAt: string;        // ISO string
}
@Injectable({
  providedIn: 'root'
})
export class OfflineDbService extends Dexie {
  books!: Dexie.Table<SoGCS, string>;
  customers!: Dexie.Table<KhachHangGCS, string>;
  pendingUpdates!: Dexie.Table<PendingUpdate, number>;

  constructor() {
    super('sogcs_offline_db');

    // ⚠️ Version 2 để đảm bảo schema mới được áp dụng
    this.version(2).stores({
      books: 'bookCode',                        // keyPath = bookCode
      customers: 'customerId, bookCode',        // customerId là PK
      pendingUpdates: '++id, customerId, synced'
    });

    this.books = this.table('books');
    this.customers = this.table('customers');
    this.pendingUpdates = this.table('pendingUpdates');
  }

  // ====== BOOKS ======
  async getBooks(): Promise<SoGCS[]> {
    return this.books.toArray();
  }

  async saveBooks(books: SoGCS[]): Promise<void> {
    await this.books.clear();
    await this.books.bulkAdd(books);
  }

  // ====== CUSTOMERS ======
  async getCustomersByBook(bookCode: string): Promise<KhachHangGCS[]> {
    return this.customers.where('bookCode').equals(bookCode).toArray();
  }

  async saveCustomers(customers: KhachHangGCS[]): Promise<void> {
    // Xóa KH cũ của các sổ có trong danh sách (đơn giản: clear hết rồi add lại)
    await this.customers.clear();
    await this.customers.bulkAdd(customers);
  }

  async updateCustomerCoord(customerId: string, lat: number, lng: number): Promise<void> {
    await this.customers.update(customerId, { lat, lng });
  }

  // ====== PENDING UPDATES ======
  async addPendingUpdate(update: Omit<PendingUpdate, 'id' | 'synced' | 'createdAt'>): Promise<void> {
    const record: PendingUpdate = {
      ...update,
      synced: 0,
      createdAt: new Date().toISOString()
    };
    await this.pendingUpdates.add(record);
  }

  async getNotSyncedUpdates(): Promise<PendingUpdate[]> {
    return this.pendingUpdates.where('synced').equals(0).toArray();
  }

  async markUpdateSynced(id: number): Promise<void> {
    await this.pendingUpdates.update(id, { synced: 1 });
  }

  async deleteSyncedUpdates(): Promise<void> {
    await this.pendingUpdates.where('synced').equals(1).delete();
  }
}
