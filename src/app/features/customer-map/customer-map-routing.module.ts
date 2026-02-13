import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMapComponent } from './customer-map.component';

const routes: Routes = [
  { path: '', component: CustomerMapComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMapRoutingModule {}
