import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class OfflineApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getTramList() {
    return this.http.get<any>(`${this.baseUrl}/d_tram/list`);
  }

  getCustomersByTram(maTram: string) {
    return this.http.get<any>(`${this.baseUrl}/hdg_vitri_ddo/getbytram/${maTram}`);
  }
}
