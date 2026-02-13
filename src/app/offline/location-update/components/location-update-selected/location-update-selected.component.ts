import { Component, OnInit } from '@angular/core';
import { LocationUpdateService } from '../../services/location-update.service';
import { LocationUpdateApiService } from '../../services/location-update-api.service';
import { SelectedCustomer } from '../../location-update.models';

@Component({
  selector: 'app-location-update-selected',
  templateUrl: './location-update-selected.component.html',
  styleUrls: ['./location-update-selected.component.scss']
})
export class LocationUpdateSelectedComponent implements OnInit {

  selectedList: SelectedCustomer[] = [];
  syncing = false;
  savingOffline = false;

  logMessages: string[] = [];

  constructor(
    private service: LocationUpdateService,
    private api: LocationUpdateApiService
  ) {}

  ngOnInit(): void {
    this.service.getSelectedCustomers$().subscribe(list => {
      this.selectedList = list || [];
    });
  }

  private log(msg: string) {
    this.logMessages.unshift(`${new Date().toLocaleTimeString()} - ${msg}`);
  }

  onBack() {
    this.service.resetSelection();   // 🧹 reset toàn bộ chọn
    window.history.back();           // ⬅️ quay lại Step 1
  }

  onGetLocation() {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ lấy tọa độ GPS.');
      return;
    }

    if (!this.selectedList || this.selectedList.length === 0) {
      alert('Vui lòng chọn ít nhất một khách hàng ở màn hình trước.');
      return;
    }

    this.log('Đang lấy tọa độ GPS...');

    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const tempCluster = this.service.generateTempCluster();

        this.service.applyLocationToSelected(lat, lng, tempCluster);
        this.log(`Đã áp dụng tọa độ (${lat}, ${lng}) cho ${this.selectedList.length} KH, tempCluster = ${tempCluster}.`);
      },
      err => {
        console.error(err);
        alert('Không lấy được tọa độ GPS. Vui lòng thử lại ngoài trời hoặc bật GPS.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  async onSaveOffline() {
    if (!this.selectedList || this.selectedList.length === 0) {
      alert('Không có dữ liệu để lưu.');
      return;
    }
    this.savingOffline = true;
    this.log('Đang lưu danh sách vị trí vào offline (IndexedDB)...');
    await this.service.persistSelectedToOffline();
    this.savingOffline = false;
    this.log('✔ Đã lưu offline thành công.');
  }

onSyncServer() {
  if (!this.selectedList || this.selectedList.length === 0) {
    alert('Không có dữ liệu để đồng bộ.');
    return;
  }

  this.syncing = true;
  this.log('Đang gửi dữ liệu vị trí lên server (set-multi)...');

  const list = this.selectedList.map(x => ({
    MA_KHANG: x.MA_KHANG,
    SO_CONGTO: x.SO_CONGTO,
    NOTE: x.NOTE ?? '',
    LAT: (x.LAT ?? 0).toString(),
    LNG: (x.LNG ?? 0).toString(),
    USER: localStorage.getItem('username') || 'unknown'
  }));

  console.log('PAYLOAD gửi lên server:', list);

  this.api.syncHdgVitriDdo(list).subscribe({
    next: (res) => {
      this.syncing = false;
      this.log('✔ Đồng bộ server thành công.');
      alert('Đã đồng bộ server thành công.');
      console.log(res);
    },
    error: (err) => {
      this.syncing = false;
      this.log('❌ Lỗi đồng bộ server: ' + err.message);
      alert('Lỗi đồng bộ server, vui lòng thử lại.');
      console.error(err);
    }
  });
}


}
