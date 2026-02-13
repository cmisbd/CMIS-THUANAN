import { Component, ViewChild, ElementRef, OnInit  } from '@angular/core';
import { CusLocationRepository } from 'src/app/data-layer/repositories/cuslocation.repository';
import { SyncOnlineService } from 'src/app/data-layer/sync/sync-online.service';
import {environment} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @ViewChild('custIdInput') custIdInput!: ElementRef;

  model = { CUSTOMEID: '', NOTE: '', LAT: '', LNG: '', USER: '' };
  customerList: any[] = [];
  username: string = "";
  constructor(
    private cusRepo: CusLocationRepository,
    private syncOnline: SyncOnlineService,
    private http: HttpClient  
  ) {}
ngOnInit():void {
  this.username = localStorage.getItem('username') || '';
  this.model.USER = this.username;
  }
  // 📍 Lấy tọa độ từ GPS
  getLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.model.LAT = pos.coords.latitude.toFixed(6);
      this.model.LNG = pos.coords.longitude.toFixed(6);
    });
  }

  // ➕ Thêm vào mảng trên giao diện
addToList() {
  const username = localStorage.getItem('username') || '';

  const item = {
    CUSTOMEID: this.model.CUSTOMEID,
    NOTE: this.model.NOTE || '',
    LAT: this.model.LAT.toString(),
    LNG: this.model.LNG.toString(),
    USER: username           // 🔥 BẮT BUỘC PHẢI CÓ
  };

  console.log("ADD ITEM:", item);  // kiểm tra xem USER có không

  this.customerList.push(item);

  // Reset form nhưng giữ USER
  this.model = {
    CUSTOMEID: '',
    NOTE: '',
    LAT: '',
    LNG: '',
    USER: username
  };
}


  remove(i: number) {
    this.customerList.splice(i, 1);
  }

  // 💾 Lưu tất cả vào IndexedDB (OFFLINE)
async saveAll() {
  try {
    await this.cusRepo.saveMany(this.customerList);

    alert("Lưu Offline thành công!");

    // Reset form + danh sách
    this.customerList = [];
    this.model = {
      CUSTOMEID: '',
      NOTE: '',
      LAT: '',
      LNG: '',
      USER: this.username
    };
  } catch (error) {
    console.error("SAVE ERROR:", error);
    alert("Lưu Offline thất bại!");
  }
}



  // 🔄 Nút sync online (nếu muốn đẩy API)
  async syncOnlineNow() {
    this.syncOnline.syncChisoToServer().subscribe(() => {
      alert("Đồng bộ lên server thành công!");
    });
  }
  async syncToServer() {
  // Lấy toàn bộ dữ liệu từ IndexedDB
  const data = await this.cusRepo.getAll();

  if (!data.length) {
    alert("Không có dữ liệu cần đồng bộ!");
    return;
  }

  this.http.post(
    `${environment.apiUrl}/clocation/set-multi`,
    data,
    { headers: { 'Content-Type': 'application/json' } }
  )
  .subscribe({
    next: async () => {
      alert("Đồng bộ lên MySQL thành công!");

      // Xóa dữ liệu offline sau khi sync
      await this.cusRepo.clear();
    },
    error: (err) => {
      console.error(err);
      alert("Đồng bộ thất bại!");
    }
  });
}
onCustIdInput(event: any) {
  const clean = event.target.value.replace(/[^0-9]/g, '');
  event.target.value = clean;              // cập nhật lên input
  this.model.CUSTOMEID = clean;           // cập nhật vào model
}
}
