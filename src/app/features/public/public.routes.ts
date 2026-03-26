import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  { path: '', loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent) },
  { path: 'elections', loadComponent: () => import('./elections-list/elections-list.component').then(m => m.PublicElectionsComponent) },
  { path: 'elections/:id/results', loadComponent: () => import('./election-results/election-results.component').then(m => m.ElectionResultsComponent) },
  { path: 'faq', loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent) },
  { path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
];
