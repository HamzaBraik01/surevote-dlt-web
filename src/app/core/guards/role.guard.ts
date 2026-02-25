import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

export function roleGuard(...roles: UserRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn) {
      router.navigate(['/auth/login']);
      return false;
    }

    const userRole = authService.userRole as UserRole;
    if (roles.includes(userRole)) {
      return true;
    }

    router.navigate(['/']);
    return false;
  };
}
