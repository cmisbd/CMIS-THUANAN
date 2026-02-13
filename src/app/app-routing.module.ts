import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // 👉 Redirect mặc định → login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 👉 Module đăng nhập
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },

  // 👉 Dashboard (layout)
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.module').then(m => m.LayoutModule)
  },

  // 👉 Bắt tất cả redirect về login
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
