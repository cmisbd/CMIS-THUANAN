import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-map',
  templateUrl: './customer-map.component.html',
  styleUrls: ['./customer-map.component.scss']
})
export class CustomerMapComponent implements AfterViewInit {

  private map!: L.Map;
  customerId: string | null = null;
  customerLat!: number;
  customerLng!: number;

  loadingRoute = false;
  errorMessage = '';

  steps: string[] = [];
  distanceText = '';
  durationText = '';


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngAfterViewInit(): void {
    // Lấy lat, lng từ query string
    this.route.queryParams.subscribe(params => {
      this.customerId = params['id'] || null;
      this.customerLat = parseFloat(params['lat']);
      this.customerLng = parseFloat(params['lng']);

      if (!isNaN(this.customerLat) && !isNaN(this.customerLng)) {
        this.initMap();
        this.locateAndDrawRoute();
      } else {
        this.errorMessage = 'Không nhận được tọa độ khách hàng.';
      }
    });
  }
  /* Mau xanh
  private customerIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }
  */
// Mau do
private customerIcon(): L.Icon {
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

  private initMap(): void {
    this.map = L.map('customerMap', {
      center: [this.customerLat, this.customerLng],
      zoom: 14
    });

    // Layer nền (OpenStreetMap – free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Marker khách hàng
    L.marker([this.customerLat, this.customerLng])
      .addTo(this.map)
      .bindPopup(`Khách hàng: ${this.customerId || ''}`)
      .openPopup();
  }

  private locateAndDrawRoute(): void {
    if (!navigator.geolocation) {
      this.errorMessage = 'Trình duyệt không hỗ trợ xác định vị trí hiện tại.';
      return;
    }

    this.loadingRoute = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

// Marker khách hàng
L.marker([this.customerLat, this.customerLng], {
  icon: this.customerIcon()
})
.addTo(this.map)
.bindPopup(`Điểm đến: ${this.customerId || ''}`)
.openPopup();
        
        // Marker vị trí hiện tại
        L.marker([userLat, userLng], { icon: this.currentLocationIcon() })
          .addTo(this.map)
          .bindPopup('Vị trí hiện tại')
          .openPopup();

        // Vẽ đường đi bằng OSRM
        this.drawRoute(userLat, userLng, this.customerLat, this.customerLng);
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Không lấy được vị trí hiện tại của thiết bị.';
        this.loadingRoute = false;
      }
    );
  }

  private drawRoute(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): void {
  
    // Bật steps=true để lấy hướng dẫn
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`;
  
    this.http.get<any>(url).subscribe({
      next: (res) => {
        try {
          // ===== LẤY THÔNG TIN CHUNG =====
          const route = res.routes[0];
          const legs = route.legs[0];
  
          // Tổng quãng đường
          const dist = route.distance; // mét
          // Tổng thời gian
          const dur = route.duration; // giây
  
          this.distanceText = (dist / 1000).toFixed(2) + ' km';
          this.durationText = Math.round(dur / 60) + ' phút';
  
          // ===== VẼ POLYLINE =====
          const coords = route.geometry.coordinates;
          const latlngs = coords.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
  
          const polyline = L.polyline(latlngs, { color: '#0066ff', weight: 5 });
          polyline.addTo(this.map);
  
          // Fit map theo polyline
          this.map.fitBounds(polyline.getBounds());
  
          // ===== LẤY DANH SÁCH CHỈ ĐƯỜNG =====
          this.steps = []; // reset
  
          legs.steps.forEach((step: any) => {
            const instruction = step.maneuver.instruction || 'Đi tiếp';
            const meters = step.distance || 0;
  
            this.steps.push(`${instruction} (${meters.toFixed(0)} mét)`);
          });
  
        } catch (e) {
          console.error('Error parsing OSRM response', e);
          this.errorMessage = 'Không phân tích được dữ liệu chỉ đường.';
        }
  
        this.loadingRoute = false;
      },
      error: (err) => {
        console.error('OSRM error:', err);
        this.errorMessage = 'Không tải được dữ liệu chỉ đường từ OSRM.';
        this.loadingRoute = false;
      }
    });
  }
  

  private currentLocationIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }
}
