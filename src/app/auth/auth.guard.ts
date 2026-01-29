import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

// ✅ SAME FILE, SAME NAME – ONLY LOGIC CHANGED
export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ Allow SSR / server render
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // ✅ Browser-side auth check
  if (auth.isLoggedIn()) {
    return true;
  }

  // ❌ Not logged in → redirect
  router.navigateByUrl('/login');
  return false;
};
