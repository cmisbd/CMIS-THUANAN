import { Component, OnInit } from '@angular/core';
import { LocationSogcsService, SoGcsItem, CustomerOfSo } from '../location-view/location-sogcs.service';
import * as L from 'leaflet';

(L.Marker.prototype as any).options.icon = L.icon({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  //shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  //popupAnchor: [1, -34],
  //shadowSize: [41, 41]
});
@Component({
  selector: 'app-location-view-sogcs',
  templateUrl: './location-view-sogcs.component.html',
  styleUrls: ['./location-view-sogcs.component.scss']
})

export class LocationViewSogcsComponent implements OnInit {

  // ============================
  // Phần lựa chọn tiêu chí
  // ============================
  searchMode: 'so' | 'kh' = 'so';   // so = theo Sổ GCS, kh = theo mã KH

  // ============================
  // Danh mục Sổ GCS (có search)
  // ============================
  keywordSo: string = "";
  listSo: SoGcsItem[] = [];
  filteredSo: SoGcsItem[] = [];

  selectedSo: string = "";
//===============================
  showMap: boolean = false;
  map: any;
  // ============================
  // Mã khách hàng
  // ============================
  maKhachHang: string = "";

  // ============================
  // Danh sách khách hàng của sổ
  // ============================
  customers: CustomerOfSo[] = [];

  showAppSelect = false;
  selectedCustomer: CustomerOfSo | null = null;
  isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  constructor(private sogcsService: LocationSogcsService) { }

  ngOnInit(): void {
    this.loadSoGcs();
  }

  // ============================
  // 1) Load danh sách Sổ GCS
  // ============================
  loadSoGcs() {
    this.sogcsService.getSoGcs().subscribe({
      next: (data) => {
        this.listSo = data;
        this.filteredSo = data; // dùng để filter search
      },
      error: () => {
        alert("Không tải được danh mục Sổ GCS");
      }
    });
  }

  // ============================
  // 2) Search Sổ GCS realtime
  // ============================
  filterSo() {
    const key = this.keywordSo.toLowerCase();

    this.filteredSo = this.listSo.filter(x =>
      x.ma_sogcs.toLowerCase().includes(key)
    );
  }

  // ============================
  // 3) Lấy khách hàng theo tiêu chí
  // ============================
  getListCustomers() {

    // --- Theo Sổ ghi chỉ số ---
    if (this.searchMode === 'so') {
      if (!this.selectedSo) {
        alert("Vui lòng chọn Sổ GCS");
        return;
      }

      this.sogcsService.getCustomersBySo(this.selectedSo).subscribe({
        next: (data) => {

          const username = localStorage.getItem('username') || '';

          this.customers = data.map(x => ({
            ...x,
            USER: username     // 🔥 Gán USER ở đây
          }));
        },
        error: () => {
          alert("Lỗi khi tải danh sách khách hàng theo Sổ GCS");
        }
      });

      return;
    }

    // --- Theo Mã khách hàng ---
    if (this.searchMode === 'kh') {
      if (!this.maKhachHang.trim()) {
        alert("Vui lòng nhập mã khách hàng");
        return;
      }
      this.sogcsService.getCustomersByMaKH(this.maKhachHang.trim()).subscribe({
        next: (data) => {

          const username = localStorage.getItem('username') || '';

          this.customers = data.map(x => ({
            ...x,
            USER: username     // 🔥 Gán USER ở đây
          }));
        },
        error: () => {
          alert("Lỗi khi tải khách hàng theo mã KH");
        }
      });

    }
  }
  // ============================
  // 4) Mở bản đồ vị trí khách hàng
  // ============================
openMap(c: CustomerOfSo) {

  if (c.lat == null || c.lng == null) {
    alert("Khách hàng chưa có tọa độ!");
    return;
  }

  const lat = Number(c.lat);
  const lng = Number(c.lng);

  this.showMap = true;

  setTimeout(() => {

    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }

    this.map = L.map('map', {
      center: [lat, lng],
      zoom: 17,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20
    }).addTo(this.map);

    L.marker([lat, lng]).addTo(this.map)
      .bindPopup(`<b>${c.ten_khang}</b><br>${c.dia_chi}`)
      .openPopup();

    // Tối ưu cho Android
setTimeout(() => {
  this.map.invalidateSize();
}, 300);

  }, 200);
}
closeMap() {
  this.showMap = false;

  if (this.map) {
    this.map.off();
    this.map.remove();
    this.map = null;
  }
}

  // ============================
  // 5) Điều hướng (chỉ đường) tới khách hàng
  // ============================
  navigate(c: CustomerOfSo) {
    console.log("Đi chỉ đường tới khách hàng:", c);

    alert("Đi chỉ đường tới khách hàng:\nMA_KHANG: " + c.ma_khang);

    // Sau này sẽ tích hợp OSRM routing
  }

 /* Hiện popup chọn ứng dụng */
  openAppSelect(c: any) {
    this.selectedCustomer = c;
    this.showAppSelect = true;
  }

  /* Đóng popup */
  closeAppSelect() {
    this.showAppSelect = false;
  }

  /* Lấy tọa độ khách hàng */
  getCustomerLatLng() {
    if (!this.selectedCustomer) return null;
    return {
      lat: Number(this.selectedCustomer.lat),
      lng: Number(this.selectedCustomer.lng)
    };
  }

  /* ========= GOOGLE MAPS ========= */
  openGoogleMaps() {
    const p = this.getCustomerLatLng();
    if (!p) return;

    navigator.geolocation.getCurrentPosition(pos => {
      const originLat = pos.coords.latitude;
      const originLng = pos.coords.longitude;

      const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${p.lat},${p.lng}&travelmode=driving`;
      window.open(url, "_blank");
    });
  }

  /* ========= GRAB ========= */
  openGrab() {
    const p = this.getCustomerLatLng();
    if (!p) return;

    const url = `grab://open?destination=${p.lat},${p.lng}`;
    window.open(url, "_blank");
  }

  /* ========= BE ========= */
  openBe() {
    const p = this.getCustomerLatLng();
    if (!p) return;

    const url = `be://open?destination=${p.lat},${p.lng}`;
    window.open(url, "_blank");
  }

  /* ========= WAZE ========= */
  openWaze() {
    const p = this.getCustomerLatLng();
    if (!p) return;

    const url = `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`;
    window.open(url, "_blank");
  }

  /* ========= APPLE MAPS (Only iOS) ========= */
  openAppleMaps() {
    const p = this.getCustomerLatLng();
    if (!p) return;

    const url = `http://maps.apple.com/?daddr=${p.lat},${p.lng}`;
    window.open(url, "_blank");
  }  

}
