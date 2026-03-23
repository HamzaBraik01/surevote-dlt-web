import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'auth/login', component: DummyComponent },
          { path: '**', component: DummyComponent }
        ]),
        AuthService
      ]
    });
  });

  it('should redirect to login when not authenticated', () => {
    localStorage.clear();
    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);
      expect(result).toBeFalsy();
    });
  });

  it('should allow access when authenticated', () => {
    localStorage.setItem('accessToken', 'test-token');
    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);
      expect(result).toBeTruthy();
    });
    localStorage.clear();
  });
});
