import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { Role } from '../models/role.model';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html'
})
export class RoleManagementComponent implements OnInit {

  roles: Role[] = [];

  // ĐÚNG: dùng chữ thường theo API
  currentRole: Role = { roleid: 0, rolename: '', description: '', state: 1 };

  isEditing = false;

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.securityService.getRoles().subscribe((res: Role[]) => {
      this.roles = res;
    });
  }

  edit(role: Role): void {
    this.isEditing = true;
    this.currentRole = { ...role };
  }

  newRole(): void {
    this.isEditing = false;
    this.currentRole = { roleid: 0, rolename: '', description: '', state: 1 };
  }

  save(): void {
    if (!this.currentRole.rolename || this.currentRole.rolename.trim() === '') {
      alert('Tên nhóm quyền không được trống');
      return;
    }

    // Nếu có roleid → update
    if (this.isEditing && this.currentRole.roleid) {
      this.securityService.updateRole(this.currentRole).subscribe(() => {
        this.load();
        this.newRole();
      });

    } else {
      // Thêm mới
      this.securityService.addRole(this.currentRole).subscribe(() => {
        this.load();
        this.newRole();
      });
    }
  }

  delete(role: Role): void {
    if (!role.roleid) { return; }
    if (confirm('Xóa nhóm quyền này?')) {
      this.securityService.deleteRole(role.roleid).subscribe(() => {
        this.load();
      });
    }
  }
}
