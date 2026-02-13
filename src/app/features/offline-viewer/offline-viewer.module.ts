import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OfflineViewerComponent } from './offline-viewer.component';
import { OfflineViewerRoutingModule } from './offline-viewer-routing.module';

@NgModule({
  declarations: [
    OfflineViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OfflineViewerRoutingModule
  ]
})
export class OfflineViewerModule { }
