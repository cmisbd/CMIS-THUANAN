import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { SecurityService } from '../features/security/security.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  menu: any[] = [];
  isMobile = false;

  fullname: string = '';
  username: string = '';

  constructor(
    private menuService: MenuService,
    private router: Router,
    private securityService: SecurityService,
  ) 
  
  {
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id_user;

this.securityService.getMenuByUser(userId).subscribe(res => {
  this.menu = res.map((m: any) => ({ ...m, open: false }));
});
  }
    

  ngOnInit() {
    this.checkScreen();
    this.fullname = localStorage.getItem('fullname') || 'Người dùng';
    this.username = localStorage.getItem('username') || '';
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleMenu(item: any) {
    item.open = !item.open;
  }

  closeIfMobile() {
    if (this.isMobile) {
      const sidenav: any = document.querySelector('mat-sidenav');
      sidenav?.close();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
  fixRoute(route: string) {
  if (!route) return null;

  // Các route thuộc module Security
  const securityRoutes = ['roles', 'role-menus', 'user-roles'];

  // Nếu route trong Security → thêm tiền tố /security/
  if (securityRoutes.includes(route)) {
    return `/security/${route}`;
  }

  // Các route còn lại (location, customers, reports, users...)
  return `/${route}`;
}

}
