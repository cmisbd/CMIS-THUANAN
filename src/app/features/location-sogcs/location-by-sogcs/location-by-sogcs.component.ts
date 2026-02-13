import { Component, OnInit, ViewChild } from '@angular/core';
import { OfflineSyncService } from 'src/app/core/services/offline-sync.service';
import { SoGCS, KhachHangGCS } from 'src/app/core/services/offline-db.service';

@Component({
  selector: 'app-location-by-sogcs',
  templateUrl: './location-by-sogcs.component.html',
  styleUrls: ['./location-by-sogcs.component.scss']
})
export class LocationBySogcsComponent implements OnInit {

  searchText: string = '';
  danhMucSo: SoGCS[] = [];
  filteredSo: SoGCS[] = [];
  selectedSo: string = '';

  customers: KhachHangGCS[] = [];
  filteredCustomers: KhachHangGCS[] = [];
  filterCustomerText: string = '';

  lat: string = '';
  lng: string = '';
  username: string = '';

  isLoadingSo = false;
  isLoadingCustomers = false;

  searchSo: string = '';

  @ViewChild('soSearchInput') soSearchInput!: any;

  constructor(
    private offlineSync: OfflineSyncService
  ) {}

  ngOnInit(): void {
    // Lấy username để gửi lên API
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        this.username = u.username || '';
      } catch {
        this.username = '';
      }
    }

    this.loadSoGcs();
  }

  // ====== SỔ GCS ======
  async loadSoGcs() {
    this.isLoadingSo = true;
    this.danhMucSo = await this.offlineSync.getBooksOfflineFirst();
    this.filteredSo = [...this.danhMucSo];
    this.isLoadingSo = false;
  }

  onSoDropdownOpen() {
    this.searchSo = '';
    this.filteredSo = this.danhMucSo;

    setTimeout(() => {
      if (this.soSearchInput) {
        this.soSearchInput.nativeElement.focus();
      }
    }, 100);
  }

  filterSo() {
    const txt = this.searchSo.toLowerCase();
    this.filteredSo = this.danhMucSo.filter(x =>
      x.bookCode.toLowerCase().includes(txt)
    );
  }

  // ====== KHÁCH HÀNG ======
  async loadCustomersBySo() {
    if (!this.selectedSo) return;

    this.isLoadingCustomers = true;

    this.customers = await this.offlineSync.getCustomersByBookOfflineFirst(this.selectedSo);
    this.filteredCustomers = [...this.customers];

    this.isLoadingCustomers = false;
  }

  filterCustomers() {
    const txt = this.filterCustomerText.trim().toLowerCase();
    this.filteredCustomers = this.customers.filter(c =>
      (c.customerCode || '').toLowerCase().includes(txt) ||
      (c.customerName || '').toLowerCase().includes(txt)
    );
  }

  // ====== LẤY TỌA ĐỘ GPS ======
  getLocation() {
    if (!navigator.geolocation) {
      alert('Thiết bị không hỗ trợ GPS');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        this.lat = pos.coords.latitude.toString();
        this.lng = pos.coords.longitude.toString();
        alert('Đã lấy tọa độ hiện tại');
      },
      err => {
        console.error(err);
        alert('Không lấy được GPS');
      }
    );
  }

  // ====== LƯU TẤT CẢ (OFFLINE-FIRST) ======
  async saveAll() {
    const latNum = Number(this.lat);
    const lngNum = Number(this.lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      alert('Tọa độ không hợp lệ');
      return;
    }

    const selected = this.filteredCustomers.filter(c => c.checked);
    if (!selected.length) {
      alert('Vui lòng chọn khách hàng');
      return;
    }

    for (const kh of selected) {
      await this.offlineSync.updateCustomerCoordOffline(kh, latNum, lngNum, this.username);

      // cập nhật lại UI
      kh.lat = latNum;
      kh.lng = lngNum;
    }

    alert('Đã lưu (offline-first): có thể chưa được sync về server nếu đang mất mạng.');
  }

  // ====== TẢI OFFLINE MASTER DATA ======
  async preloadOfflineData() {
    this.isLoadingSo = true;
    await this.offlineSync.loadMasterDataFromServer();
    this.isLoadingSo = false;

    alert('Đã tải Sổ + (tuỳ chọn) dữ liệu cần thiết về offline DB.');
  }

  // ====== ĐỒNG BỘ LÊN SERVER ======
  async manualSync() {
    await this.offlineSync.pushPendingUpdatesToServer();
    alert('Đã đồng bộ dữ liệu chờ (nếu có).');
  }
}
