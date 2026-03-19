import { Routes } from '@angular/router';
import { VoterLayoutComponent } from './voter-layout.component';

export const voterRoutes: Routes = [
  {
    path: '',
    component: VoterLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.VoterDashboardComponent) },
      { path: 'vote/:electionId', loadComponent: () => import('./voting-booth/voting-booth.component').then(m => m.VotingBoothComponent) },
      { path: 'receipts', loadComponent: () => import('./receipts/receipts.component').then(m => m.VoterReceiptsComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
