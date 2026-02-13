import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CustomerMapRoutingModule } from './customer-map-routing.module';
import { CustomerMapComponent } from './customer-map.component';

@NgModule({
  declarations: [
    CustomerMapComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CustomerMapRoutingModule
  ]
})
export class CustomerMapModule { }
