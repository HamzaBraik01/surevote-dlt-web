import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  Utilisateur, LoginRequest, RegisterRequest, AuthResponse,
  RefreshTokenRequest, Verify2FARequest, PasswordResetRequest, PasswordResetConfirm,
  UserRole
} from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  get currentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  get userRole(): string | null {
    return this.currentUser?.role ?? null;
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.handleAuthResponse(res)),
      catchError(err => throwError(() => err))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken } as RefreshTokenRequest).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  verify2FA(data: Verify2FARequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/2fa/verify`, data).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  resend2FA(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/2fa/resend`, {});
  }

  getCurrentUser(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  requestPasswordReset(data: PasswordResetRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password-reset/request`, data);
  }

  confirmPasswordReset(data: PasswordResetConfirm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password-reset/confirm`, data);
  }

  /** Change password for the currently logged-in user */
  changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, data);
  }

  /** Toggle 2FA for the currently logged-in user */
  toggle2FA(enable: boolean): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/2fa/toggle`, { enable }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /** Decode JWT payload to extract the authoritative role */
  private getRoleFromToken(token: string): UserRole | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.role as UserRole) ?? null;
    } catch {
      return null;
    }
  }

  private handleAuthResponse(res: AuthResponse): void {
    if (res.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
    }
    if (res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
    }

    // Extract the authoritative role from the JWT token (backend JSON body may be stale)
    const jwtRole = res.accessToken ? this.getRoleFromToken(res.accessToken) : null;
    const authorativeRole = jwtRole ?? (res.role as UserRole);

    // Backend may return user data as a nested object or as flat top-level fields
    let user = res.user;
    if (!user && authorativeRole) {
      user = {
        id: res.userId ?? 0,
        cin: '',
        nom: res.nom ?? '',
        prenom: res.prenom ?? '',
        email: res.email ?? '',
        role: authorativeRole,
        actif: res.enabled ?? true,
        doubleFacteurActif: res.doubleFacteurActif ?? false,
        dateCreation: new Date().toISOString()
      };
    }
    // Always override the role with the JWT token role if available
    if (user && jwtRole) {
      user = { ...user, role: jwtRole };
    }
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        this.currentUserSubject.next(JSON.parse(stored));
      } catch {
        this.clearSession();
      }
    }
  }
}
