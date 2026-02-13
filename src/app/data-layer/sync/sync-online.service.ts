import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GcsChisoRepository } from '../repositories/gcs-chiso.repository';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Service dùng để đồng bộ dữ liệu từ IndexedDB lên server khi online.
 * Ở đây demo sync cho bảng GCS_CHISO, sau này có thể mở rộng.
 */
@Injectable({ providedIn: 'root' })
export class SyncOnlineService {

  constructor(
    private http: HttpClient,
    private gcsChisoRepo: GcsChisoRepository
  ) {}

  /**
   * Lấy toàn bộ chỉ số trong IndexedDB và gửi lên API để lưu.
   * API demo: POST /api/gcs/sync-chiso
   */
  syncChisoToServer(): Observable<any> {
    return from(this.gcsChisoRepo.getAll()).pipe(
      switchMap(list => {
        if (!list || !list.length) {
          // Không có gì để sync, trả về Observable rỗng
          return this.http.post('/api/gcs/sync-chiso', []);
        }
        return this.http.post('/api/gcs/sync-chiso', list);
      })
    );
  }
}
