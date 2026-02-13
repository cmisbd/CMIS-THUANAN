import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LocationViewSogcsComponent } from './location-view-sogcs.component';
import { LocationViewSogcsRoutingModule } from './location-view-sogcs-routing.module';

@NgModule({
  declarations: [LocationViewSogcsComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    LocationViewSogcsRoutingModule
  ]
})
export class LocationViewSogcsModule {}
