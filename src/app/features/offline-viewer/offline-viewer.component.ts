import { Component, OnInit } from '@angular/core';
import { DmSoGcsRepository } from 'src/app/data-layer/repositories/dm-sogcs.repository';
import { CusLocationRepository } from 'src/app/data-layer/repositories/cuslocation.repository';
import { GcsChisoRepository } from 'src/app/data-layer/repositories/gcs-chiso.repository';
import { HDGVitriDdoRepository } from 'src/app/data-layer/repositories/hdg-vitri-ddo.repository';
import { DTramRepository } from 'src/app/data-layer/repositories/d-tram.repository';
import { GlobalSyncService } from 'src/app/data-layer/sync/global-sync.service';


@Component({
  selector: 'app-offline-viewer',
  templateUrl: './offline-viewer.component.html',
  styleUrls: ['./offline-viewer.component.scss']
})
export class OfflineViewerComponent implements OnInit {

  selectedTable: string | null = null;
  data: any[] = [];
  columns: string[] = [];

  constructor(
    private sogcs: DmSoGcsRepository,
    private cus: CusLocationRepository,
    private chiso: GcsChisoRepository,
    private vitri: HDGVitriDdoRepository,
    private tram: DTramRepository,
    private sync: GlobalSyncService
  ) {}

  ngOnInit() {
    this.setTable('DM_SOGCS');
  }

async setTable(tbl: string) {
  this.selectedTable = tbl;

  // Xóa data cũ ngay lập tức để UI refresh
  this.data = [];
  this.columns = [];

  // Delay 1 tick để Angular render lại (rất quan trọng)
  await new Promise(res => setTimeout(res, 1));

  // Lấy dữ liệu bảng mới
  if (tbl === 'DM_SOGCS') this.data = await this.sogcs.getAll();
  if (tbl === 'CUSLOCATION') this.data = await this.cus.getAll();
  if (tbl === 'GCS_CHISO') this.data = await this.chiso.getAll();
  if (tbl === 'HDG_VITRI_DDO') this.data = await this.vitri.getAll();
  if (tbl === 'D_TRAM') this.data = await this.tram.getAll();

  // Tạo lại danh sách cột
  if (this.data.length > 0) {
    this.columns = Object.keys(this.data[0]);
  }
}

  async clearCurrent() {
    if (!confirm(`Xóa toàn bộ dữ liệu của ${this.selectedTable}?`)) return;

    if (this.selectedTable === 'DM_SOGCS') await this.sogcs.clear();
    if (this.selectedTable === 'CUSLOCATION') await this.cus.clear();
    if (this.selectedTable === 'GCS_CHISO') await this.chiso.clear();
    if (this.selectedTable === 'HDG_VITRI_DDO') await this.vitri.clear();
    if (this.selectedTable === 'D_TRAM') await this.tram.clear();

    this.setTable(this.selectedTable!);
  }
async syncAll() {
  try {
    // Không chọn bảng nào thì thôi
    if (!this.selectedTable) {
      alert('Vui lòng chọn bảng cần đồng bộ.');
      return;
    }

    if (this.selectedTable === 'CUSLOCATION') {
      // ====== ĐỒNG BỘ CUSLOCATION (GIỮ LOGIC CŨ) ======
      const ok = await this.cus.syncToServer();

      if (ok) {
        alert('Đồng bộ CUSLOCATION thành công!');
        await this.cus.clear();              // Xóa offline sau khi sync
        this.setTable(this.selectedTable);   // Reload lưới
      } else {
        alert('CUSLOCATION: Không có dữ liệu hoặc lỗi khi đồng bộ!');
      }

    } else if (this.selectedTable === 'HDG_VITRI_DDO') {
      // ====== ĐỒNG BỘ VỊ TRÍ ĐO (HDG_VITRI_DDO) ======
      const ok = await this.vitri.syncToServer();

      if (ok) {
        alert('Đồng bộ HDG_VITRI_DDO thành công!');
        await this.vitri.clear();            // Xóa offline sau khi sync
        this.setTable(this.selectedTable);   // Reload lưới
      } else {
        alert('HDG_VITRI_DDO: Không có dữ liệu hoặc lỗi khi đồng bộ!');
      }

    } else {
      alert('Bảng này hiện chưa hỗ trợ đồng bộ offline.');
    }

  } catch (err) {
    console.error(err);
    alert('Lỗi khi gọi API đồng bộ!');
  }
}

}
