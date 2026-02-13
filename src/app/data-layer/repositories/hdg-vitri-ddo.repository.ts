import { Injectable } from '@angular/core';
import { HdgVitriDdoStore } from '../indexeddb/hdg-vitri-ddo.store';
import { openGcsDb  } from '../indexeddb/db-config';
import { GCS_STORE_NAMES } from '../indexeddb/db-config';
import {HdgVitriDdoModel} from '../models/hdg-vitri-ddo.model'
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HDGVitriDdoRepository {
  private readonly baseUrl = 'https://itthuanan.vn:8081/api/hdg_vitri_ddo';
  constructor(private store: HdgVitriDdoStore,private http: HttpClient,) {}
  clear() {
    return this.store.clear();
  }

  /**
   * Lưu 1 record
   */
  saveOne(item: any) {
    return this.store.putOne(item);
  }

  /**
   * Lưu nhiều record
   */
  saveMany(list: any[]) {
    return this.store.bulkSave(list);
  }

  /**
   * Lấy theo composite key (MA_KHANG + SO_CONGTO)
   */
  getOne(maKhang: string, soCongTo: string) {
    return this.store.getByKey({
      maKhang,
      soCongTo
    });
  }

  /**
   * Xoá theo composite key
   */
  async delete(key: { maKhang: string; soCongTo: string }): Promise<void> {
    const db = await openGcsDb();

    if (!key.maKhang || !key.soCongTo) {
      console.error("❌ delete() thiếu composite key", key);
      return;
    }

    const tx = db.transaction(GCS_STORE_NAMES.HDG_VITRI_DDO, 'readwrite');
    await tx.store.delete([key.maKhang, key.soCongTo]);
    await tx.done;
  }


  /**
   * Tìm tất cả KH theo mã trạm
   */
  async getByMaTram(maTram: string) {
    const all = await this.store.getAll();
    return all.filter(x => x.MA_TRAM === maTram);
  }

  /**
   * Lấy tất cả offline
   */
  getAll() {
    return this.store.getAll();
  }
  // 🔍 Tìm khách hàng theo số công tơ (SO_CONGTO)
  async findBySoCongTo(soCongTo: string): Promise<HdgVitriDdoModel | undefined> {
    const all = await this.store.getAll();
    return all.find(x => x.SO_CONGTO === soCongTo);
}

  /** Đồng bộ toàn bộ bản ghi HDG_VITRI_DDO trong IndexedDB lên server (set-multi) */
async syncToServer(): Promise<boolean> {
  // 1. Lấy toàn bộ dữ liệu offline
  const all = await this.getAll();

  if (!all || all.length === 0) {
    return false; // không có gì để sync
  }

  // 2. Chỉ lấy những dòng CÓ tempCluster (đã cập nhật offline)
  const needSync = all.filter((x: any) =>
    x.tempCluster !== null &&
    x.tempCluster !== undefined &&
    x.tempCluster !== ''    // tùy con dùng kiểu số hay chuỗi, nhưng check thế này là an toàn
  );

  if (!needSync.length) {
    // Không có dòng nào được đánh dấu cần đồng bộ
    return false;
  }

  const username = localStorage.getItem('username') || 'unknown';

  // 3. Map sang payload giống Step 2 (LocationUpdateSelected)
  const payload = needSync.map((x: any) => ({
    MA_KHANG: x.MA_KHANG,
    SO_CONGTO: x.SO_CONGTO,
    NOTE: x.NOTE ?? '',
    LAT: (x.LAT ?? 0).toString(),
    LNG: (x.LNG ?? 0).toString(),
    USER: x.USER || username
  }));

  try {
    await firstValueFrom(
      this.http.post(`${this.baseUrl}/set-multi`, payload)
    );

    return true;
  } catch (err) {
    console.error('Lỗi sync HDG_VITRI_DDO lên server:', err);
    return false;
  }
}



}
