import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineLoaderComponent } from './offline-loader.component';
import { OfflineLoaderRoutingModule } from './offline-loader-routing.module';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';




@NgModule({
  declarations: [
    OfflineLoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OfflineLoaderRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule
  ]
})
export class OfflineLoaderModule {}
