import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { CustomerManagementComponent } from './customer-management.component';


@NgModule({
  declarations: [
    CustomerManagementComponent
  ],
  imports: [
    CommonModule,
    CustomerManagementRoutingModule
  ]
})
export class CustomerManagementModule { }
