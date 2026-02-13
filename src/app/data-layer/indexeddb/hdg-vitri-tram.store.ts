import { Injectable } from '@angular/core';
import { openGcsDb } from '../indexeddb/db-config';
import { GCS_STORE_NAMES } from '../indexeddb/db-config';

@Injectable({
  providedIn: 'root'
})
export class HdgVitriTramStore {

  async putMany(list: any[]): Promise<void> {
    const db = await openGcsDb();
    const tx = db.transaction(GCS_STORE_NAMES.HDG_VITRI_TRAM, 'readwrite');
    const store = tx.objectStore(GCS_STORE_NAMES.HDG_VITRI_TRAM);

    for (const x of list) {

      // 🔥 Chuẩn hóa field — bắt buộc để match keyPath
      const item = {
        MA_KHANG: x.MA_KHANG ?? x.ma_khang,
        SO_CONGTO: x.SO_CONGTO ?? x.so_congto,
        MA_TRAM: x.MA_TRAM ?? x.ma_tram,
        CLUSTER: x.CLUSTER ?? x.cluster,
        LAT: x.LAT ?? x.lat,
        LNG: x.LNG ?? x.lng,
        NOTE: x.NOTE ?? x.note,
        USER: x.USER ?? x.user,
        CREATEDATE: x.CREATEDATE ?? x.createdate,
        UPDATEDATE: x.UPDATEDATE ?? x.updatedate,
        tempCluster: x.tempCluster ?? null   // Angular sẽ sinh
      };

      // Nếu thiếu key → In lỗi để debug
      if (!item.MA_KHANG || !item.SO_CONGTO) {
        console.error("❌ Thiếu MA_KHANG hoặc SO_CONGTO:", item);
        continue;
      }

      store.put(item);
    }

    await tx.done;
  }

async putOne(item: any): Promise<void> {
  const db = await openGcsDb();

  if (!item.MA_KHANG || !item.SO_CONGTO) {
    console.error("❌ putOne() thiếu khóa chính", item);
    return;
  }

  const tx = db.transaction(GCS_STORE_NAMES.HDG_VITRI_TRAM, 'readwrite');
  await tx.store.put(item);
  await tx.done;
}
async bulkSave(items: any[]): Promise<void> {
  const db = await openGcsDb();
  const tx = db.transaction(GCS_STORE_NAMES.HDG_VITRI_TRAM, 'readwrite');

  for (const item of items) {
    if (!item.MA_KHANG || !item.SO_CONGTO) {
      console.error("❌ bulkSave() bỏ qua item vì thiếu key", item);
      continue;
    }
    await tx.store.put(item);
  }

  await tx.done;
}


  async getAll(): Promise<any[]> {
    const db = await openGcsDb();
    return db.getAll(GCS_STORE_NAMES.HDG_VITRI_TRAM);
  }

async clear(): Promise<void> {
  const db = await openGcsDb();
  const tx = db.transaction(GCS_STORE_NAMES.HDG_VITRI_TRAM, 'readwrite');
  await tx.store.clear();
  await tx.done;
}


async getByKey(key: { maKhang: string; soCongTo: string }): Promise<any> {
  const db = await openGcsDb();
  return await db.get(GCS_STORE_NAMES.HDG_VITRI_TRAM, [
    key.maKhang,
    key.soCongTo
  ]);
}


async delete(maKhang: string, soCongTo: string): Promise<void> {
  const db = await openGcsDb();
  const tx = db.transaction(GCS_STORE_NAMES.HDG_VITRI_TRAM, 'readwrite');
  tx.store.delete([maKhang, soCongTo]);
  await tx.done;
}

}
