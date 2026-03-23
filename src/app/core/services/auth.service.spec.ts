import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => { httpMock.verify(); localStorage.clear(); });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should login and store tokens', () => {
    const mockRes = { accessToken: 'at123', refreshToken: 'rt456', user: { id: 1, nom: 'Test', prenom: 'User', email: 'test@test.com', cin: '123', role: 'ELECTEUR', actif: true, doubleFacteurActif: false, dateCreation: '' } };
    service.login({ email: 'test@test.com', motDePasse: 'pass' }).subscribe(res => {
      expect(res.accessToken).toBe('at123');
      expect(localStorage.getItem('accessToken')).toBe('at123');
      expect(localStorage.getItem('refreshToken')).toBe('rt456');
    });
    httpMock.expectOne('http://localhost:8080/api/auth/login').flush(mockRes);
  });

  it('should register', () => {
    const mockRes = { accessToken: 'at', refreshToken: 'rt' };
    service.register({ cin: '123', nom: 'A', prenom: 'B', email: 'a@b.com', motDePasse: 'pass', confirmationMotDePasse: 'pass', doubleFacteurActif: false }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('should verify 2FA', () => {
    service.verify2FA({ otpCode: '123456' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/2fa/verify');
    expect(req.request.method).toBe('POST');
    req.flush({ accessToken: 'at', refreshToken: 'rt' });
  });

  it('should logout and clear session', () => {
    localStorage.setItem('accessToken', 'test');
    service.logout().subscribe(() => {
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
    httpMock.expectOne('http://localhost:8080/api/auth/logout').flush(null);
  });

  it('should refresh token', () => {
    localStorage.setItem('refreshToken', 'old-rt');
    service.refreshToken().subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/refresh');
    expect(req.request.body.refreshToken).toBe('old-rt');
    req.flush({ accessToken: 'new-at', refreshToken: 'new-rt' });
  });

  it('should get current user', () => {
    service.getCurrentUser().subscribe(u => expect(u.email).toBe('a@b.com'));
    httpMock.expectOne('http://localhost:8080/api/auth/me').flush({ id: 1, email: 'a@b.com', nom: 'A', prenom: 'B', cin: '1', role: 'ELECTEUR', actif: true, doubleFacteurActif: false, dateCreation: '' });
  });

  it('should request password reset', () => {
    service.requestPasswordReset({ email: 'a@b.com' }).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/auth/password-reset/request');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should loadUserFromStorage', () => {
    // Reset TestBed so we can reconfigure with localStorage pre-populated
    localStorage.setItem('currentUser', JSON.stringify({ id: 1, nom: 'X', prenom: 'Y', email: 'x@y.com', cin: '1', role: 'ADMIN', actif: true, doubleFacteurActif: false, dateCreation: '' }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()]
    });
    const s = TestBed.inject(AuthService);
    expect(s.currentUser?.role).toBe('ADMIN');
    localStorage.clear();
  });

  it('should return isLoggedIn false when no token', () => {
    expect(service.isLoggedIn).toBeFalsy();
  });

  it('should return isLoggedIn true when token exists', () => {
    localStorage.setItem('accessToken', 'token');
    expect(service.isLoggedIn).toBeTruthy();
  });
});
