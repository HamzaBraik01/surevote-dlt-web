import { HttpInterceptorFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  // URLs where we should NOT attach a Bearer token at all
  const skipTokenUrl = req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh') || req.url.includes('/login') || req.url.includes('/register');
  // URLs where we should NOT attempt token refresh on 401 (includes 2FA which needs token but shouldn't trigger refresh)
  const skipRefreshUrl = skipTokenUrl || req.url.includes('/auth/2fa/') || req.url.includes('/auth/password-reset/');

  let authReq = req;
  if (token && !skipTokenUrl) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Never try to refresh tokens for auth-related requests (login, register, 2FA, password-reset)
      if (error.status === 401 && !skipRefreshUrl) {
        return handle401(authService, toastService, router, authReq, next);
      }

      switch (error.status) {
        case 403:
          toastService.error('Accès interdit. Permissions insuffisantes.');
          break;
        case 0:
          toastService.error('Impossible de contacter le serveur.');
          break;
        default:
          if (error.status >= 500) {
            toastService.error('Erreur serveur. Réessayez plus tard.');
          }
      }
      return throwError(() => error);
    })
  );
};

function handle401(
  authService: AuthService,
  toastService: ToastService,
  router: Router,
  req: Parameters<HttpInterceptorFn>[0],
  next: Parameters<HttpInterceptorFn>[1]
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      authService.clearSession();
      router.navigate(['/auth/login']);
      toastService.error('Session expirée. Veuillez vous reconnecter.');
      return throwError(() => new Error('No refresh token'));
    }

    return authService.refreshToken().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshTokenSubject.next(res.accessToken);
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } }));
      }),
      catchError((err) => {
        isRefreshing = false;
        refreshTokenSubject.error(err);
        refreshTokenSubject = new BehaviorSubject<string | null>(null);
        authService.clearSession();
        router.navigate(['/auth/login']);
        toastService.error('Session expirée. Veuillez vous reconnecter.');
        return throwError(() => err);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
  );
}
