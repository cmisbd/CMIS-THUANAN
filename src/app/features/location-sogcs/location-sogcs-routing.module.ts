import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationBySogcsComponent } from './location-by-sogcs/location-by-sogcs.component';

const routes: Routes = [
  { path: '', component: LocationBySogcsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationBySogcsRoutingModule { }
