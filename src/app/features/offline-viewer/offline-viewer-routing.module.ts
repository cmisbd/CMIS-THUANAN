import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfflineViewerComponent } from './offline-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: OfflineViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineViewerRoutingModule {}
