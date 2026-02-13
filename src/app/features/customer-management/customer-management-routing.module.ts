import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';

const routes: Routes = [
  { path: '', component: CustomerManagementComponent }  // path rỗng vì đã prefix ở layout: 'home'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
