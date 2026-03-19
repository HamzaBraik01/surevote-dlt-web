import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { MetricsSummary, ParticipationBreakdown } from '../../../core/models';

@Component({
  selector: 'app-observer-metrics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-on-surface">Tableau de Bord Observateur</h1>
      <p class="text-on-surface-variant mt-1 text-sm">Vue d'ensemble de l'intégrité et des métriques électorales.</p>
    </header>

    <!-- Live Status -->
    <div class="flex items-center gap-3 mb-8 p-3 bg-emerald-500/10 rounded-xl w-fit">
      <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
      <span class="text-xs font-bold text-emerald-700 uppercase tracking-widest">Système Nominal — Surveillance Active</span>
    </div>

    <!-- Metrics Bento Grid -->
    @if (summary) {
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-surface-container-lowest p-6 rounded-xl">
          <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Élections</p>
          <p class="text-3xl font-black text-primary">{{ summary.totalElections }}</p>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl">
          <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Élections Actives</p>
          <p class="text-3xl font-black text-emerald-600">{{ summary.electionsPubliees || summary.activeElections || 0 }}</p>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl">
          <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Votes</p>
          <p class="text-3xl font-black text-on-surface">{{ (summary.totalVotesCastes ?? summary.totalVotesCast ?? 0) | number }}</p>
        </div>
        <div class="bg-surface-container-lowest p-6 rounded-xl">
          <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Participation Moy.</p>
          <p class="text-3xl font-black text-primary">{{ (summary.tauxParticipationMoyen ?? summary.averageParticipation ?? 0) | number:'1.1-1' }}%</p>
        </div>
      </div>
    }

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <!-- Participation Breakdown -->
      <div class="bg-surface-container-lowest rounded-xl p-8">
        <h2 class="text-lg font-bold text-on-surface mb-6">Participation par Élection</h2>
        @if (participation.length === 0) {
          <p class="text-sm text-on-surface-variant text-center py-8">Aucune donnée disponible.</p>
        } @else {
          <div class="space-y-4">
            @for (p of participation; track p.electionId) {
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium text-on-surface">{{ p.titre || 'Élection #' + p.electionId }}</span>
                  <span class="text-sm font-bold text-primary">{{ p.tauxParticipation | number:'1.1-1' }}%</span>
                </div>
                <div class="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full transition-all duration-500" [style.width.%]="p.tauxParticipation"></div>
                </div>
                <div class="flex justify-between text-xs text-on-surface-variant mt-1">
                  <span>{{ p.totalVotes ?? p.votesExprimes ?? 0 }} votes</span>
                  <span>{{ p.totalElecteursEligibles ?? p.totalElecteurs ?? 0 }} inscrits</span>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Integrity Summary -->
      <div class="bg-surface-container-lowest rounded-xl p-8">
        <h2 class="text-lg font-bold text-on-surface mb-6">Rapport d'Intégrité</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-xl">
            <span class="material-symbols-outlined text-emerald-600 text-2xl" style="font-variation-settings: 'FILL' 1;">verified</span>
            <div>
              <p class="font-bold text-emerald-700">Chaîne de hachage intacte</p>
              <p class="text-xs text-emerald-600">Vérification automatique toutes les 15 minutes</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
            <span class="material-symbols-outlined text-primary text-2xl">shield</span>
            <div>
              <p class="font-bold text-on-surface">AES-256 actif</p>
              <p class="text-xs text-on-surface-variant">Chiffrement de bout en bout sur tous les votes</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
            <span class="material-symbols-outlined text-primary text-2xl">lock</span>
            <div>
              <p class="font-bold text-on-surface">Audit non-répudiation</p>
              <p class="text-xs text-on-surface-variant">Traçabilité complète de chaque opération</p>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <a routerLink="/observer/audit" class="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            Consulter le journal d'audit <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-gradient-to-br from-inverse-surface to-slate-800 rounded-xl p-8 text-white">
        <span class="material-symbols-outlined text-3xl mb-4">file_download</span>
        <h3 class="text-xl font-bold mb-2">Exporter le Rapport Complet</h3>
        <p class="text-slate-300 text-sm leading-relaxed mb-6">Générez un rapport PDF contenant toutes les métriques et l'historique d'audit.</p>
        <button (click)="exportReport()" class="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10">
          Télécharger le PDF
        </button>
      </div>
      <div class="bg-surface-container-lowest rounded-xl p-8">
        <span class="material-symbols-outlined text-3xl text-primary mb-4">gpp_maybe</span>
        <h3 class="text-xl font-bold text-on-surface mb-2">Tentatives de Fraude</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed mb-6">Consultez les tentatives de fraude détectées par le système.</p>
        <a routerLink="/observer/audit" class="px-6 py-3 bg-rose-500/10 text-rose-800 font-bold rounded-xl hover:bg-rose-500/20 transition-colors inline-flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">security</span> Voir les alertes
        </a>
      </div>
    </div>
  `
})
export class ObserverMetricsComponent implements OnInit {
  summary: MetricsSummary | null = null;
  participation: ParticipationBreakdown[] = [];

  constructor(private auditService: AuditService, private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auditService.getSummary().subscribe({ next: (d) => { this.summary = d; this.cdr.markForCheck(); }, error: () => this.toastService.error('Erreur métriques') });
    this.auditService.getParticipation().subscribe({ next: (d) => { this.participation = d; this.cdr.markForCheck(); }, error: () => this.toastService.error('Erreur participation') });
  }

  exportReport(): void {
    this.auditService.exportFull().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'observer-report.pdf'; a.click();
        URL.revokeObjectURL(url);
      }
    });
  }
}
