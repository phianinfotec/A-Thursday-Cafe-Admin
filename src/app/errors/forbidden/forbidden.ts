import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden.html',
  styleUrls: ['./forbidden.css'],
})
export class ForbiddenComponent {

  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']); // ✅ FIXED
  }
}
