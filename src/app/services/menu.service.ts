import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private api = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  getMenu(): Observable<any> {
    return this.http.get<any>(`${this.api}/get`);
  }
}
