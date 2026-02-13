import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { OfflineApiService } from './offline-api.service';
import { DTramRepository } from 'src/app/data-layer/repositories/d-tram.repository';
import { HDGVitriDdoRepository } from 'src/app/data-layer/repositories/hdg-vitri-ddo.repository';

@Component({
  selector: 'app-offline-loader',
  templateUrl: './offline-loader.component.html',
  styleUrls: ['./offline-loader.component.scss']
})
export class OfflineLoaderComponent implements OnInit {

  maTramInput: string = '';     // ⭐ thay selectedTram bằng mã nhập tay
  loading = false;
  logMessages: string[] = [];

  constructor(
    private api: OfflineApiService,
    private tramStore: DTramRepository,
    private vitriStore: HDGVitriDdoRepository
  ) {}

  ngOnInit(): void {}

  log(msg: string) {
    this.logMessages.unshift(`${new Date().toLocaleTimeString()} - ${msg}`);
  }

  // ⭐ Hàm mới — tải trạm + khách hàng theo mã trạm nhập tay
  async loadTramAndCustomersByCode() {
    try {
      if (!this.maTramInput || this.maTramInput.trim() === '') {
        this.log("⚠ Vui lòng nhập mã trạm.");
        return;
      }

      this.loading = true;
      const maTram = this.maTramInput.trim();

      // 1️⃣ Tải danh sách trạm nếu offline chưa có
      let trams = await this.tramStore.getAll();
      if (!trams || trams.length === 0) {
        this.log("📥 Đang tải danh sách trạm từ server...");

        const res = await lastValueFrom(this.api.getTramList());
        const normalized = res.items.map((x: any) => ({
          MA_TRAM: x.MA_TRAM ?? x.ma_tram,
          TEN_TRAM: x.TEN_TRAM ?? x.ten_tram
        }));

        await this.tramStore.saveMany(normalized);
        trams = normalized;

        this.log(`✔ Đã lưu ${normalized.length} trạm Offline`);
      }

      // 2️⃣ Kiểm tra mã trạm có tồn tại không
      const exists = trams.find(t => t.MA_TRAM === maTram);
      if (!exists) {
        this.log(`❌ Không tìm thấy trạm '${maTram}' trong danh sách.`);
        return;
      }

      // 3️⃣ Tải KH theo trạm
      this.log(`📥 Đang tải khách hàng cho trạm ${maTram}...`);

      const resKh = await lastValueFrom(
        this.api.getCustomersByTram(maTram)
      );

      const normalizedKh = resKh.items.map((x: any) => ({
        MA_KHANG: x.ma_khang,
        SO_CONGTO: x.so_congto,
        MA_TRAM: x.ma_tram,
        LAT: x.lat,
        LNG: x.lng,
        CLUSTER: x.cluster,
        NOTE: x.note,
        USER: x.user,
        CREATEDATE: x.createdate,
        UPDATEDATE: x.updatedate,
        tempCluster: null
      }));

      await this.vitriStore.saveMany(normalizedKh);

      this.log(`✔ Đã lưu ${normalizedKh.length} khách hàng trạm ${maTram}`);

    } catch (err) {
      console.error(err);
      this.log("❌ Lỗi khi tải dữ liệu Offline!");
    } finally {
      this.loading = false;
    }
  }
}
