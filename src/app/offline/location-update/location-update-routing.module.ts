import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationUpdateMainComponent } from './components/location-update-main/location-update-main.component';
import { LocationUpdateSelectedComponent } from './components/location-update-selected/location-update-selected.component';

const routes: Routes = [
  {
    path: '',
    component: LocationUpdateMainComponent
  },
  {
    path: 'selected',
    component: LocationUpdateSelectedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationUpdateRoutingModule {}
