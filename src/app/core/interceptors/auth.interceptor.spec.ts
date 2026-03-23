import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let authService: any;
  let toastService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      getAccessToken: vi.fn().mockReturnValue('test-token'),
      getRefreshToken: vi.fn().mockReturnValue(null),
      refreshToken: vi.fn(),
      clearSession: vi.fn(),
      currentUser: null
    };
    toastService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    };
    router = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
        { provide: Router, useValue: router }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => httpMock.verify());

  it('should add Authorization header for non-auth URLs', () => {
    http.get('/api/test').subscribe();
    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('should NOT add Authorization header for auth URLs', () => {
    http.post('/api/auth/login', {}).subscribe();
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should show error toast on 403', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    expect(toastService.error).toHaveBeenCalledWith('Accès interdit. Permissions insuffisantes.');
  });

  it('should show error toast on 500', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush('Error', { status: 500, statusText: 'Internal Server Error' });
    expect(toastService.error).toHaveBeenCalledWith('Erreur serveur. Réessayez plus tard.');
  });

  it('should show connection error on status 0', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').error(new ProgressEvent('error'), { status: 0 });
    expect(toastService.error).toHaveBeenCalledWith('Impossible de contacter le serveur.');
  });

  it('should clear session on 401 when no refresh token', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(authService.clearSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
