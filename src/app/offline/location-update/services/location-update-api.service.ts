import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HdgVitriDdoModel } from '../location-update.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationUpdateApiService {

  private baseUrl = (environment as any).apiUrl || (environment as any).baseUrl || '';

  constructor(private http: HttpClient) {}

  /**
   * Gửi danh sách vị trí đã cập nhật lên server (API set-multi)
   * Tùy backend, học trò chỉnh lại payload cho đúng.
   */
  /*
   syncHdgVitriDdo(list: HdgVitriDdoModel[]): Observable<any> {
     const url = `${this.baseUrl}/hdg_vitri_ddo/set-multi`;
 
     const payload = {
       total: list.length,
       items: list
     };
 
     return this.http.post(url, payload);
   }
     */
  syncHdgVitriDdo(list: any[]): Observable<any> {
    const url = `${this.baseUrl}/hdg_vitri_ddo/set-multi`;
    return this.http.post(url, list);
  }



}
