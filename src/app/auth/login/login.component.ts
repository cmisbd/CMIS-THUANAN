import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  doLogin() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res?.success) {
          // Lưu thông tin user
          localStorage.setItem('fullname', res.fullname);
          localStorage.setItem('username', res.username);
          localStorage.setItem('state', res.state);

          localStorage.setItem('user', JSON.stringify(res));

          // Chuyển sang layout chính (home)
          this.router.navigate(['/home']);  // Version cu:  this.router.navigate(['/home']);
        }
      },
      error: () => {
        alert('Sai tên đăng nhập hoặc mật khẩu!');
      }
    });
  }
}
