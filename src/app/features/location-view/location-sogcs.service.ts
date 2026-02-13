import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface SoGcsItem {
  ma_sogcs: string;
}

export interface CustomerOfSo {
  ma_khang: string;
  ten_khang: string;
  dia_chi: string;
  lat: number | null;
  lng: number | null;
}
@Injectable({
  providedIn: 'root'
})
export class LocationSogcsService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Lấy danh mục sổ

  getSoGcs(): Observable<SoGcsItem[]> {
    return this.http.get<SoGcsItem[]>(`${this.api}/sogcs/get`);
  }
  // Lấy khách hàng theo Sổ
  getCustomersBySo(so: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/location/getbyso/${so}`);
  }

  // ⭐ NEW → Lấy khách hàng theo Mã KH
  getCustomersByMaKH(ma_khang: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/location/getbykh/${ma_khang}`);
  }
}
