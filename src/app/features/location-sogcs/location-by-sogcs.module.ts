import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LocationBySogcsRoutingModule } from './location-sogcs-routing.module';
import { LocationBySogcsComponent } from './location-by-sogcs/location-by-sogcs.component';
import { MatIconModule } from '@angular/material/icon';
import {FilterCustomerPipe} from '../location-sogcs/location-by-sogcs/filterCustomer.pipe';

@NgModule({
  declarations: [
    LocationBySogcsComponent,
    FilterCustomerPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    LocationBySogcsRoutingModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule   
  ]
})
export class LocationbysogcsModule { }
