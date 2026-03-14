import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { UserService } from '../../../core/services/user.service';
import { Election, UserStats } from '../../../core/models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    @if (loading) {
      <div class="flex justify-center py-20">
        <div class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else {
    <header class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-on-surface">Vue d'ensemble</h1>
      <p class="text-on-surface-variant mt-1">Tableau de bord administratif SureVote.</p>
    </header>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Élections</p>
        <p class="text-3xl font-black text-primary">{{ elections.length }}</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Utilisateurs</p>
        <p class="text-3xl font-black text-on-surface">{{ userStats?.totalUsers || 0 }}</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Actifs</p>
        <p class="text-3xl font-black text-emerald-600">{{ userStats?.activeUsers || 0 }}</p>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Inactifs</p>
        <p class="text-3xl font-black text-rose-600">{{ userStats?.inactiveUsers || 0 }}</p>
      </div>
    </div>

    <!-- Recent Elections -->
    <h2 class="text-xl font-bold text-on-surface mb-4">Élections récentes</h2>
    <div class="bg-surface-container-lowest rounded-xl overflow-hidden mb-8">
      <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-surface-container-low">
            <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Titre</th>
            <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Statut</th>
            <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Début</th>
            <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fin</th>
            <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          @for (e of elections.slice(0, 5); track e.id) {
            <tr class="hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/10 last:border-b-0">
              <td class="px-6 py-4 font-semibold text-on-surface">{{ e.titre }}</td>
              <td class="px-6 py-4"><app-status-badge [status]="e.statut" /></td>
              <td class="px-6 py-4 text-on-surface-variant">{{ e.dateDebut | date:'dd/MM/yyyy' }}</td>
              <td class="px-6 py-4 text-on-surface-variant">{{ e.dateFin | date:'dd/MM/yyyy' }}</td>
              <td class="px-6 py-4 text-right">
                <a [routerLink]="['/admin/elections', e.id]" class="text-primary font-semibold text-sm hover:underline">Détails</a>
              </td>
            </tr>
          }
        </tbody>
      </table>
      </div>
    </div>

    @if (elections.length === 0) {
      <div class="text-center py-12 bg-surface-container-lowest rounded-xl text-on-surface-variant mb-8">
        <span class="material-symbols-outlined text-5xl mb-4">ballot</span>
        <p class="font-medium">Aucune élection pour le moment.</p>
      </div>
    }

    <a routerLink="/admin/elections" class="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
      Voir toutes les élections <span class="material-symbols-outlined text-sm">arrow_forward</span>
    </a>
    }
  `
})
export class AdminDashboardComponent implements OnInit {
  elections: Election[] = [];
  userStats: UserStats | null = null;
  loading = true;

  constructor(private electionService: ElectionService, private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.electionService.list().subscribe({
      next: (d) => { this.elections = Array.isArray(d) ? d : []; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
    this.userService.getStats().subscribe({ next: (d) => { this.userStats = d; this.cdr.markForCheck(); }, error: () => {} });
  }
}
