import { Routes } from '@angular/router';
import { ObserverLayoutComponent } from './observer-layout.component';

export const observerRoutes: Routes = [
  {
    path: '',
    component: ObserverLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./metrics/metrics.component').then(m => m.ObserverMetricsComponent) },
      { path: 'audit', loadComponent: () => import('./audit-journal/audit-journal.component').then(m => m.AuditJournalComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
