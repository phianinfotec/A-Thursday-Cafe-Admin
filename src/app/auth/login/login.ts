import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitted = false;
  error = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  showPassword: any;

  submit() {
    this.submitted = true;
    this.error = ''; // Clear previous error
    if (this.loginForm.invalid) return;

    // 🔥 CALL LOGIN API
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        // Check if response indicates failure
        if (res.success === false || res.error || !res.token) {
          // ← Added res.success === false check
          console.log('Login failed with message:', res.message);
          this.error = res.message || 'Invalid email or password'; // ← Now displays "Invalid email/password"
          return;
        }

        console.log('11111111111111111', res.token);
        console.log('Login successful');
        // // 🔥 SAVE TOKEN
        this.auth.saveToken(res.token);

        // // 🔥 CASE 1
        // if (res.token) {
        //   this.auth.saveToken(res.token);
        // }

        // // 🔥 CASE 2 (agar token data ke andar ho)
        // else if (res.data?.token) {
        //   this.auth.saveToken(res.data.token);
        // }

        // 🔥 REDIRECT
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard');
        }, 0);
      },
      error: (err) => {
        // Handle different error response formats
        if (err.error && err.error.errors && err.error.errors.length > 0) {
          // Backend validation errors format
          this.error = err.error.errors[0].msg || 'Invalid email or password';
        } else if (err.error && err.error.message) {
          // Custom error message from backend
          this.error = err.error.message;
        } else {
          // Default error message
          this.error = 'Invalid email or password';
        }
      },
    });
  }

  onInputChange() {
    this.error = ''; // Clear error when user starts typing
  }
}
