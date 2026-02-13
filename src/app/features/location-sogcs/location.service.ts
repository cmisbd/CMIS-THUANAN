import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSoGcs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/sogcs/get`);
  }

  getCustomersBySo(so: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/location/getbyso/${so}`);
  }

  saveMulti(items: any[]): Observable<any> {
    return this.http.post(`${this.api}/location/set-multi`, items);
  }
}
