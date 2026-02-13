import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

@Component({
  selector: 'app-user-role-permission',
  templateUrl: './user-role-permission.component.html'
})
export class UserRolePermissionComponent implements OnInit {

  users: User[] = [];
  roles: Role[] = [];
  selectedUserId?: number;
  checked = new Set<number>();

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.securityService.getUsers().subscribe((res: User[]) => {
      this.users = res;
    });
  }

  loadRoles(): void {
    this.securityService.getRoles().subscribe((res: Role[]) => {
      this.roles = res;
    });
  }

  onUserChange(): void {
    if (!this.selectedUserId) { return; }
    this.securityService.getUserRoles(this.selectedUserId).subscribe((ids: number[]) => {
      this.checked = new Set(ids);
    });
  }

  toggle(roleId: number, event: any): void {
    if (event.checked) {
      this.checked.add(roleId);
    } else {
      this.checked.delete(roleId);
    }
  }

  isChecked(roleId: number): boolean {
    return this.checked.has(roleId);
  }

  save(): void {
    if (!this.selectedUserId) {
      alert('Vui lòng chọn người dùng');
      return;
    }
    const ids = Array.from(this.checked);
    this.securityService.saveUserRoles(this.selectedUserId, ids).subscribe(() => {
      alert('Đã lưu phân quyền nhóm quyền cho người dùng');
    });
  }
}
