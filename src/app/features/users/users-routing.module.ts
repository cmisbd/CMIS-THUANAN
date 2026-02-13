import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../users/users.component';

const routes: Routes = [
  { path: '', component: UsersComponent }  // path rỗng vì đã prefix ở layout: 'home'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
