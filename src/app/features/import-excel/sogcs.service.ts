import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoGcsService {

  private api = environment.apiUrl;   // Ví dụ: https://itthuanan.vn:8081/api

  constructor(private http: HttpClient) {}

  // ============================
  // IMPORT EXCEL
  // ============================
  importExcel(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append("file", file);

    const req = new HttpRequest(
      'POST',
      `${this.api}/sogcs/import`,  // ⭐ API import của con
      formData,
      { reportProgress: true }
    );

    return this.http.request(req);
  }
}
