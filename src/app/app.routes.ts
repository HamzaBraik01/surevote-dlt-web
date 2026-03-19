import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes
  { path: '', loadChildren: () => import('./features/public/public.routes').then(m => m.publicRoutes) },

  // Auth routes
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) },

  // Voter routes (protected)
  {
    path: 'voter',
    canActivate: [authGuard],
    loadChildren: () => import('./features/voter/voter.routes').then(m => m.voterRoutes)
  },

  // Admin routes (protected, ADMIN role)
  {
    path: 'admin',
    canActivate: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // Observer routes (protected, OBSERVATEUR or ADMIN role)
  {
    path: 'observer',
    canActivate: [roleGuard('OBSERVATEUR', 'ADMIN')],
    loadChildren: () => import('./features/observer/observer.routes').then(m => m.observerRoutes)
  },

  // Fallback
  { path: '**', loadComponent: () => import('./features/public/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
