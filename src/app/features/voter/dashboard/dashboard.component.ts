import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VoteService } from '../../../core/services/vote.service';
import { ToastService } from '../../../core/services/toast.service';
import { Election, VoteReceipt } from '../../../core/models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-voter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <!-- Top App Bar -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-on-surface">Portail Électeur</h1>
        <p class="text-on-surface-variant mt-2 text-lg">Bienvenue, {{ userName }}. Consultez vos scrutins actifs.</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="glass-panel p-2 rounded-xl flex items-center space-x-2 px-4 shadow-sm">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span class="text-sm font-semibold text-emerald-800">Système Sécurisé</span>
        </div>
      </div>
    </header>

    <!-- Stats Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <p class="text-sm font-medium text-on-surface-variant mb-1">Votes exprimés</p>
        <h3 class="text-3xl font-bold text-primary">{{ receipts.length }}</h3>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <p class="text-sm font-medium text-on-surface-variant mb-1">Élections actives</p>
        <h3 class="text-3xl font-bold text-on-surface">{{ eligibleElections.length }}</h3>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <p class="text-sm font-medium text-on-surface-variant mb-1">Dernier reçu</p>
        <p class="text-sm font-bold text-on-surface font-mono">{{ lastReceipt || '—' }}</p>
      </div>
    </div>

    <!-- Scrutins en cours -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-on-surface">Scrutins en cours</h2>
    </div>

    @if (loading) {
      <div class="flex justify-center py-12">
        <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else if (eligibleElections.length === 0) {
      <div class="text-center py-16 text-on-surface-variant bg-surface-container-lowest rounded-xl">
        <span class="material-symbols-outlined text-5xl mb-4">ballot</span>
        <p class="font-medium">Aucun scrutin actif pour le moment.</p>
      </div>
    } @else {
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        @for (e of eligibleElections; track e.id) {
          <div class="group bg-surface-container-lowest rounded-xl p-1 flex flex-col transition-all duration-300 hover:translate-y-[-4px]">
            <div class="relative h-48 w-full rounded-t-xl overflow-hidden mb-4 hero-gradient flex items-center justify-center">
              <span class="material-symbols-outlined text-white/20 text-[80px]">how_to_vote</span>
              <div class="absolute top-4 right-4">
                <app-status-badge [status]="e.statut" [pulse]="e.statut === 'OUVERTE'" />
              </div>
            </div>
            <div class="px-5 pb-6">
              <h3 class="text-xl font-bold text-on-surface mb-2 leading-tight">{{ e.titre }}</h3>
              <p class="text-on-surface-variant text-sm mb-6 line-clamp-2">{{ e.description }}</p>
              <div class="flex items-center space-x-2 mb-6">
                <span class="material-symbols-outlined text-on-surface-variant text-sm">calendar_today</span>
                <span class="text-xs font-semibold text-on-surface-variant uppercase">Fin le {{ e.dateFin | date:'dd MMM, HH:mm' }}</span>
              </div>
              @if (e.statut === 'OUVERTE') {
                <a [routerLink]="['/voter/vote', e.id]"
                  class="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                  <span>Voter maintenant</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              } @else {
                <button class="w-full bg-surface-container-high text-on-secondary-container font-bold py-4 rounded-xl flex items-center justify-center space-x-2 cursor-not-allowed">
                  <span>Voir les résultats</span>
                  <span class="material-symbols-outlined text-sm">visibility</span>
                </button>
              }
            </div>
          </div>
        }
      </div>
    }

    <!-- Activity & Security -->
    <div class="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-8">
        <h2 class="text-xl font-bold text-on-surface mb-6">Activité récente</h2>
        <div class="bg-surface-container-lowest rounded-2xl overflow-hidden">
          @for (r of receipts.slice(0, 4); track r.id) {
            <div class="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors border-b border-outline-variant/10 last:border-b-0">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                </div>
                <div>
                  <p class="text-sm font-bold">Vote validé : {{ r.electionTitre || 'Élection #' + r.electionId }}</p>
                  <p class="text-xs text-on-surface-variant">{{ r.dateVote | date:'dd MMM yyyy, HH:mm' }}</p>
                </div>
              </div>
              <span class="text-xs font-mono text-primary">{{ r.recuCryptographique | slice:0:12 }}...</span>
            </div>
          }
          @if (receipts.length === 0) {
            <div class="p-8 text-center text-on-surface-variant text-sm">Aucune activité récente.</div>
          }
        </div>
      </div>
      <div class="lg:col-span-4">
        <div class="bg-gradient-to-br from-inverse-surface to-slate-800 rounded-2xl p-8 text-white">
          <span class="material-symbols-outlined text-3xl mb-4">security</span>
          <h3 class="text-xl font-bold mb-2">Audit de Sécurité</h3>
          <p class="text-on-surface-variant/70 text-sm leading-relaxed mb-6">Votre identité numérique est protégée par un chiffrement de bout en bout conforme aux normes RGPD.</p>
          <button class="text-sm font-bold underline underline-offset-4 hover:text-white transition-colors">Vérifier mon certificat</button>
        </div>
      </div>
    </div>
  `
})
export class VoterDashboardComponent implements OnInit {
  eligibleElections: Election[] = [];
  receipts: VoteReceipt[] = [];
  loading = true;

  constructor(private authService: AuthService, private voteService: VoteService, private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  get userName(): string {
    const u = this.authService.currentUser;
    return u ? `${u.prenom} ${u.nom}` : 'Utilisateur';
  }

  get lastReceipt(): string {
    return this.receipts.length > 0 ? '#' + this.receipts[0].recuCryptographique.substring(0, 12) : '';
  }

  ngOnInit(): void {
    this.voteService.getEligibleElections().subscribe({
      next: (data) => { this.eligibleElections = data; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); this.toastService.error('Erreur lors du chargement des élections'); }
    });
    this.voteService.getMyVotes().subscribe({
      next: (data) => { this.receipts = data; this.cdr.markForCheck(); },
      error: () => this.toastService.error('Erreur lors du chargement des reçus')
    });
  }
}
