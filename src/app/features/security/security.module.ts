import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SecurityRoutingModule } from './security-routing.module';
import { RoleManagementComponent } from './role-management/role-management.component';
import { RoleMenuPermissionComponent } from './role-menu-permission/role-menu-permission.component';
import { UserRolePermissionComponent } from './user-role-permission/user-role-permission.component';

@NgModule({
  declarations: [
    RoleManagementComponent,
    RoleMenuPermissionComponent,
    UserRolePermissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SecurityRoutingModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule
  ]
})
export class SecurityModule { }
