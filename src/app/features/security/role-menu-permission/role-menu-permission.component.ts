import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security.service';
import { Role } from '../models/role.model';
import { MenuItem } from '../models/menu.model';

@Component({
  selector: 'app-role-menu-permission',
  templateUrl: './role-menu-permission.component.html'
})
export class RoleMenuPermissionComponent implements OnInit {

  roles: Role[] = [];
  menuTree: MenuItem[] = [];
  selectedRoleId?: number;
  checked = new Set<number>();

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadMenuTree();
  }

  loadRoles(): void {
    this.securityService.getRoles().subscribe((res: Role[]) => {
      this.roles = res;
    });
  }

  loadMenuTree(): void {
    this.securityService.getMenuTree().subscribe((res: MenuItem[]) => {
      this.menuTree = res;
    });
  }

  onRoleChange(): void {
    if (!this.selectedRoleId) { return; }
    this.securityService.getRoleMenus(this.selectedRoleId).subscribe((ids: number[]) => {
      this.checked = new Set(ids);
    });
  }

  toggle(menu: MenuItem, event: any): void {
    const isChecked = event.checked;
    this.setCheckedRecursive(menu, isChecked);
  }

  setCheckedRecursive(menu: MenuItem, isChecked: boolean): void {
    if (isChecked) {
      this.checked.add(menu.id);
    } else {
      this.checked.delete(menu.id);
    }

    if (menu.children && menu.children.length) {
      menu.children.forEach(child => this.setCheckedRecursive(child, isChecked));
    }
  }

  isChecked(menuId: number): boolean {
    return this.checked.has(menuId);
  }

  save(): void {
    if (!this.selectedRoleId) {
      alert('Vui lòng chọn nhóm quyền');
      return;
    }
    const ids = Array.from(this.checked);
    this.securityService.saveRoleMenus(this.selectedRoleId, ids).subscribe(() => {
      alert('Đã lưu phân quyền chức năng cho nhóm quyền');
    });
  }
}
