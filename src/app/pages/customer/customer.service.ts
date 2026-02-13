import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './customer.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private api = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  searchCustomer(keyword: string): Observable<Customer[]> {
    return this.http.post<Customer[]>(`${this.api}/search`, { keyword });
  }
}
