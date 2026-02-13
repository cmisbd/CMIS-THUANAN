import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomerLocationRoutingModule } from './customer-location-routing.module';
import { LocationComponent } from './components/location/location.component';

@NgModule({
  declarations: [
    LocationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CustomerLocationRoutingModule
  ]
})
export class CustomerLocationModule {}
