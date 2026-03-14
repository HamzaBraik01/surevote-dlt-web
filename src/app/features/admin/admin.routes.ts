import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'elections', loadComponent: () => import('./elections/elections.component').then(m => m.ElectionsComponent) },
      { path: 'elections/:id', loadComponent: () => import('./election-detail/election-detail.component').then(m => m.ElectionDetailComponent) },
      { path: 'candidates', loadComponent: () => import('./candidates/candidates.component').then(m => m.AdminCandidatesComponent) },
      { path: 'users', loadComponent: () => import('./users/users.component').then(m => m.AdminUsersComponent) },
      { path: 'colleges', loadComponent: () => import('./colleges/colleges.component').then(m => m.AdminCollegesComponent) },
      { path: 'colleges/:id', loadComponent: () => import('./college-detail/college-detail.component').then(m => m.CollegeDetailComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
