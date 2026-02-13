import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  ReportsComponent} from '../reports/reports.component';

const routes: Routes = [
  { path: '', component: ReportsComponent }  // path rỗng vì đã prefix ở layout: 'home'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
