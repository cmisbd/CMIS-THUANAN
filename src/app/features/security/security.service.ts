import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Role } from './models/role.model';
import { MenuItem } from './models/menu.model';
import { User } from './models/user.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  // TODO: sửa lại base URL cho đúng API của hệ thống
  private api = environment.apiUrl;

  //private apiUrl = 'https://your-api.com/api';

  constructor(private http: HttpClient) {}

  // ===== ROLE =====
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.api}/role`);
  }

  addRole(role: Role): Observable<any> {
    return this.http.post(`${this.api}/role/add`, role);
  }

  updateRole(role: Role): Observable<any> {
    return this.http.put(`${this.api}/role/update`, role);
  }

  deleteRole(roleId: number): Observable<any> {
    return this.http.delete(`${this.api}/role/delete/${roleId}`);
  }

  // ===== MENU TREE & ROLEOFMENU =====
  getMenuTree(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.api}/menu/get`);
  }

  getRoleMenus(roleId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.api}/roleofmenu/${roleId}`);
  }

  saveRoleMenus(roleId: number, menuIds: number[]): Observable<any> {
    return this.http.post(`${this.api}/roleofmenu/save`, {
      ROLEID: roleId,
      MENU_IDS: menuIds
    });
  }

  // ===== USER & ROLEOFUSER =====
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.api}/users/get`);
  }

  getUserRoles(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.api}/roleofuser/${userId}`);
  }

  saveUserRoles(userId: number, roleIds: number[]): Observable<any> {
    return this.http.post(`${this.api}/roleofuser/save`, {
      ID_USER: userId,
      ROLEIDS: roleIds
    });
  }
  getMenuByUser(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/menu/getbyuser/${userId}`);
}

}
