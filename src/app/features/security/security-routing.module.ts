import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleManagementComponent } from './role-management/role-management.component';
import { RoleMenuPermissionComponent } from './role-menu-permission/role-menu-permission.component';
import { UserRolePermissionComponent } from './user-role-permission/user-role-permission.component';

const routes: Routes = [
  { path: 'roles', component: RoleManagementComponent },
  { path: 'role-menus', component: RoleMenuPermissionComponent },
  { path: 'user-roles', component: UserRolePermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
