import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router, private authService: AuthService) {}

  get usuario() {
    return this.authService.usuario; // puede ser null y el HTML ya lo maneja con ?
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  irLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
