import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      isLoggedIn: true,
      userRole: 'ADMIN'
    };
    router = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should allow access for matching role', () => {
    const guard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should deny access for non-matching role', () => {
    authService.userRole = 'ELECTEUR';
    const guard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to login if not logged in', () => {
    authService.isLoggedIn = false;
    const guard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should accept multiple roles', () => {
    authService.userRole = 'OBSERVATEUR';
    const guard = roleGuard('ADMIN', 'OBSERVATEUR');
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(true);
  });
});
