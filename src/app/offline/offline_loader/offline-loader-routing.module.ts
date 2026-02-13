import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfflineLoaderComponent } from './offline-loader.component';

const routes: Routes = [
  {
    path: '',
    component: OfflineLoaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfflineLoaderRoutingModule {}
