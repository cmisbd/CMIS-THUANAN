import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationViewSogcsComponent } from './location-view-sogcs.component';

const routes: Routes = [
  { path: '', component: LocationViewSogcsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationViewSogcsRoutingModule {}
