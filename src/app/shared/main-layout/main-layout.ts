import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header';

@Component({
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `
})


export class MainLayout {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']); // ✅ works
  // }
}
