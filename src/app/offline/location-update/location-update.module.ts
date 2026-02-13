import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationUpdateRoutingModule } from './location-update-routing.module';
import { LocationUpdateMainComponent } from './components/location-update-main/location-update-main.component';
import { LocationUpdateSelectedComponent } from './components/location-update-selected/location-update-selected.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';


@NgModule({
  declarations: [
    LocationUpdateMainComponent,
    LocationUpdateSelectedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LocationUpdateRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule
  ]
})
export class LocationUpdateModule {}
