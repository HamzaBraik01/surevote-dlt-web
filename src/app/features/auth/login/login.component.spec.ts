import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any;
  let toastService: any;
  let router: Router;

  beforeEach(async () => {
    authService = {
      login: vi.fn(),
      getCurrentUser: vi.fn(),
      isLoggedIn: false,
      getAccessToken: vi.fn().mockReturnValue(null),
      currentUser: null
    };
    toastService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should mark form as valid when filled', () => {
    component.loginForm.patchValue({ email: 'test@test.com', password: '12345678' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should call authService.login on valid submit', () => {
    const mockResponse = { accessToken: 'tok', refreshToken: 'ref', user: { id: 1, role: 'ELECTEUR' } };
    authService.login.mockReturnValue(of(mockResponse as any));

    component.loginForm.patchValue({ email: 'test@test.com', password: '12345678' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
  });

  it('should navigate to voter dashboard on ELECTEUR login', () => {
    authService.login.mockReturnValue(of({ accessToken: 'tok', user: { role: 'ELECTEUR' } } as any));

    component.loginForm.patchValue({ email: 'test@test.com', password: '12345678' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/voter/dashboard']);
  });

  it('should display server error on login failure', () => {
    authService.login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));

    component.loginForm.patchValue({ email: 'test@test.com', password: '12345678' });
    component.onSubmit();

    expect(component.serverError).toBe('Invalid credentials');
  });

  it('should set loading to false after error', () => {
    authService.login.mockReturnValue(throwError(() => ({ error: { message: 'Error' } })));

    component.loginForm.patchValue({ email: 'test@test.com', password: '12345678' });
    component.onSubmit();

    expect(component.loading).toBe(false);
  });
});
