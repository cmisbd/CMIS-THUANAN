import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },  /* path: '', redirectTo: 'home', pathMatch: 'full'*/

      {
        path: 'home',
        loadChildren: () =>
          import('../features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../features/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../features/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'customer-management',
        loadChildren: () =>
          import('../features/customer-management/customer-management.module')
            .then(m => m.CustomerManagementModule)
      },
      {
        path: 'customer-map',
        loadChildren: () =>
          import('../features/customer-map/customer-map.module')
            .then(m => m.CustomerMapModule)
      },
      {
        path: '',
        children: [
          {
            path: 'location',
            loadChildren: () => import('../pages/location/customer-location.module')
              .then(m => m.CustomerLocationModule)
          }
        ]
      },
      {
        path: 'customers',
        loadChildren: () => import('../pages/customer/customer.module').then(m => m.CustomerModule)
      },
      // 👉 Thêm route Security tại đây
      {
        path: 'security',
        loadChildren: () =>
          import('../features/security/security.module').then(
            m => m.SecurityModule
          )
      },
      // 👉 Thêm route Location tại đây
      {
        path: 'by-sogcs',
        loadChildren: () =>
          import('../features/location-sogcs/location-by-sogcs.module').then(
            m => m.LocationbysogcsModule
          )
      },
      {
        path: 'by-views',
        loadChildren: () =>
          import('../features/location-view/location-view-sogcs.module').then(
            m => m.LocationViewSogcsModule
          )
      },
      {
        path: 'import-excel',
        loadChildren: () =>
          import('../features/import-excel/import-excel.module').then(
            m => m.ImportExcelModule
          )
      },
      {
        path: 'test-numeric',
        loadChildren: () =>
          import('../utilities/numeric-keypad/test-numeric.module').then(
            m => m.TestNumericModule 
          )
      },
      {
        path: 'offline-viewer',
        loadChildren: () =>
          import('../features/offline-viewer/offline-viewer.module')
            .then(m => m.OfflineViewerModule)
      },
      {
        path: 'offline-loader',
        loadChildren: () =>
          import('../offline/offline_loader/offline-loader.module')
            .then(m => m.OfflineLoaderModule)
      },
      {
        path: 'location-update',
        loadChildren: () =>
          import('../offline/location-update/location-update.module')
            .then(m => m.LocationUpdateModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
