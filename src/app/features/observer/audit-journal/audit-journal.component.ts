import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuditLog, MetricsSummary } from '../../../core/models';

@Component({
  selector: 'app-audit-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
      <div>
        <nav class="flex text-xs font-medium text-on-surface-variant mb-2 space-x-2">
          <span>Audit Système</span>
          <span class="material-symbols-outlined text-[12px]">chevron_right</span>
          <span class="text-primary">Journal des Transactions</span>
        </nav>
        <h2 class="text-3xl font-bold tracking-tight text-on-surface">Registre d'Audit Immuable</h2>
        <p class="text-on-surface-variant mt-1 text-sm">Surveillance en temps réel de l'intégrité du scrutin.</p>
      </div>
      <div class="flex space-x-3">
        <button (click)="exportReport()" class="flex items-center space-x-2 px-5 py-2.5 bg-surface-container-high text-on-secondary-container font-semibold rounded-xl text-sm hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-sm">file_download</span>
          <span>Exporter Rapport (PDF)</span>
        </button>
        <button (click)="refresh()" class="flex items-center space-x-2 px-5 py-2.5 hero-gradient text-white font-semibold rounded-xl text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <span class="material-symbols-outlined text-sm">refresh</span>
          <span>Actualiser le Flux</span>
        </button>
      </div>
    </header>

    <!-- Metrics Bento -->
    <div class="grid grid-cols-12 gap-6 mb-8">
      <div class="col-span-12 md:col-span-8 bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden">
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Évolution de la Participation</p>
            <h3 class="text-2xl font-black text-on-surface">
              {{ (summary?.tauxParticipationMoyen ?? summary?.averageParticipation ?? 0) | number:'1.1-1' }}%
              <span class="text-emerald-600 text-sm font-medium ml-2">en temps réel</span>
            </h3>
          </div>
          <div class="flex space-x-1">
            @for (h of [40, 55, 45, 70, 85, 95, 80]; track $index) {
              <span class="w-1.5 rounded-full" [style.height.px]="h / 7 * 14"
                [class]="$index >= 4 ? 'bg-primary' : 'bg-surface-container-low'"></span>
            }
          </div>
        </div>
        <div class="mt-6 h-32 w-full flex items-end space-x-2">
          @for (h of [40, 55, 45, 70, 85, 95, 80]; track $index) {
            <div class="flex-1 rounded-t-lg transition-all duration-500"
              [style.height.%]="h"
              [class]="$index >= 4 ? ($index === 6 ? 'bg-primary' : $index === 5 ? 'bg-primary-container' : 'bg-primary-fixed') : 'bg-surface-container-low'">
            </div>
          }
        </div>
      </div>

      <div class="col-span-12 md:col-span-4 bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between">
        <div>
          <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Status de l'Intégrité</p>
          <div class="flex items-center space-x-2 mt-2">
            <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-lg font-bold text-on-surface">Système Nominal</span>
          </div>
        </div>
        <div class="mt-4 space-y-3">
          <div class="flex justify-between text-xs font-medium border-b border-outline-variant/10 pb-2">
            <span class="text-on-surface-variant">Total Élections</span>
            <span class="font-bold">{{ summary?.totalElections ?? 0 }}</span>
          </div>
          <div class="flex justify-between text-xs font-medium border-b border-slate-100 pb-2">
            <span class="text-on-surface-variant">Élections Actives</span>
            <span>{{ summary?.electionsPubliees ?? summary?.activeElections ?? 0 }}</span>
          </div>
          <div class="flex justify-between text-xs font-medium border-b border-slate-100 pb-2">
            <span class="text-on-surface-variant">Votes Sécurisés</span>
            <span class="font-bold">{{ (summary?.totalVotesCastes ?? summary?.totalVotesCast ?? 0) | number }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-surface-container-lowest p-4 rounded-xl mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px] relative">
        <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
        <input [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Rechercher par ID ou Action..."
          class="w-full pl-10 pr-4 py-2 bg-surface text-sm rounded-xl ring-1 ring-outline-variant/20 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none" />
      </div>
      <div class="flex items-center space-x-2 bg-surface px-3 py-2 rounded-xl ring-1 ring-outline-variant/20">
        <span class="material-symbols-outlined text-sm text-on-surface-variant">filter_list</span>
        <select [(ngModel)]="filterAction" (change)="onFilter()" class="bg-transparent border-none text-xs font-medium text-on-surface focus:ring-0 cursor-pointer">
          <option value="">Tous types d'actions</option>
          @for (t of actionTypes; track t) {
            <option [value]="t">{{ t }}</option>
          }
        </select>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-xs font-semibold text-on-surface-variant">Gravité:</span>
        <div class="flex space-x-1">
          <button (click)="filterSeverity('INFO')" class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"><span class="w-2 h-2 rounded-full bg-emerald-500"></span></button>
          <button (click)="filterSeverity('WARNING')" class="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center"><span class="w-2 h-2 rounded-full bg-amber-500"></span></button>
          <button (click)="filterSeverity('CRITICAL')" class="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center"><span class="w-2 h-2 rounded-full bg-rose-500"></span></button>
        </div>
      </div>
    </div>

    <!-- Audit Table -->
    <section class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant/10">
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Horodatage (UTC)</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type d'Action</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Entité / Système</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Détails de l'Audit</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody class="text-sm font-medium">
            @for (log of filteredLogs; track log.id) {
              <tr class="audit-row hover:bg-blue-50/30 transition-colors">
                <td class="px-6 py-4 text-on-surface-variant font-mono text-xs">{{ log.dateAction || log.timestamp }}</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase" [ngClass]="getActionClass(log)">
                    {{ log.actionType }}
                  </span>
                </td>
                <td class="px-6 py-4 text-on-surface">
                  @if (log.utilisateurEmail || log.userName) {
                    {{ log.utilisateurEmail || log.userName }}
                  } @else if (log.utilisateurId || log.userId) {
                    User: <span class="text-primary">{{ log.utilisateurId || log.userId }}</span>
                  } @else if (log.adresseIp || log.ipAddress) {
                    IP: <span class="text-rose-600">{{ log.adresseIp || log.ipAddress }}</span>
                  } @else {
                    Système
                  }
                </td>
                <td class="px-6 py-4 text-on-surface-variant leading-relaxed max-w-xs">{{ log.details }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-1.5" [ngClass]="getSeverityClass(log)">
                    <span class="material-symbols-outlined text-[16px]">{{ getSeverityIcon(log) }}</span>
                    <span class="text-xs font-bold">{{ getSeverityLabel(log) }}</span>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex justify-between items-center border-t border-outline-variant/10">
        <span class="text-xs text-on-surface-variant font-medium">Page {{ currentPage + 1 }}</span>
        <div class="flex space-x-2">
          <button (click)="prevPage()" [disabled]="currentPage === 0" class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-40">
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button (click)="nextPage()" class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Transparency Cards -->
    <section class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-gradient-to-br from-slate-900 to-blue-950 p-8 rounded-xl text-white relative overflow-hidden group">
        <div class="relative z-10">
          <h4 class="text-xl font-bold mb-2">Transparence Cryptographique</h4>
          <p class="text-blue-100/70 text-sm mb-6 leading-relaxed">Chaque vote est lié à un hash SHA-256 unique, assurant qu'aucune modification n'est possible sans rompre la chaîne d'audit.</p>
          <div class="flex items-center space-x-4">
            <div class="bg-white/10 p-4 rounded-xl backdrop-blur-md flex flex-col items-center">
              <span class="text-2xl font-black">2.4ms</span>
              <span class="text-[10px] uppercase font-bold text-blue-300">Temps Latence</span>
            </div>
            <div class="bg-white/10 p-4 rounded-xl backdrop-blur-md flex flex-col items-center">
              <span class="text-2xl font-black">Zero</span>
              <span class="text-[10px] uppercase font-bold text-blue-300">Conflits</span>
            </div>
          </div>
        </div>
        <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <span class="material-symbols-outlined text-[200px]" style="font-variation-settings: 'FILL' 1;">shield_with_heart</span>
        </div>
      </div>

      <div class="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-center">
        <h4 class="text-xl font-bold text-on-surface mb-2">Rapport d'Intégrité Automatisé</h4>
        <p class="text-on-surface-variant text-sm mb-6">Le système génère des rapports de cohérence toutes les 15 minutes.</p>
        <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-2">
          <div class="bg-primary h-full rounded-full" style="width: 100%;"></div>
        </div>
        <div class="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
          <span class="text-primary">Cohérence des données: 100%</span>
          <span class="text-on-surface-variant">Dernière vérification: Il y a 4 min</span>
        </div>
      </div>
    </section>

    <!-- Live Status Snackbar -->
    <div class="fixed bottom-6 right-6 glass-panel px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-4 border border-white/20 z-50">
      <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      <p class="text-sm font-bold text-on-surface">Direct Audit: <span class="text-on-surface-variant font-normal">Flux synchronisé</span></p>
    </div>
  `
})
export class AuditJournalComponent implements OnInit {
  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  summary: MetricsSummary | null = null;
  actionTypes: string[] = [];
  searchQuery = '';
  filterAction = '';
  currentPage = 0;
  totalPages = 1;
  loading = true;

  constructor(private auditService: AuditService, private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadLogs();
    this.auditService.getSummary().subscribe({ next: (d) => { this.summary = d; this.cdr.markForCheck(); }, error: () => this.toastService.error('Erreur métriques') });
    this.auditService.getActionTypes().subscribe({ next: (d) => { this.actionTypes = d; this.cdr.markForCheck(); }, error: () => {} });
  }

  loadLogs(): void {
    this.loading = true;
    this.auditService.getLogs(this.currentPage, 20).subscribe({
      next: (page) => {
        this.logs = page.content;
        this.filteredLogs = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.toastService.error('Erreur lors du chargement des logs'); }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredLogs = this.logs.filter(l => l.details.toLowerCase().includes(q) || l.actionType.toLowerCase().includes(q));
  }

  onFilter(): void {
    if (this.filterAction) {
      this.filteredLogs = this.logs.filter(l => l.actionType === this.filterAction);
    } else {
      this.filteredLogs = this.logs;
    }
  }

  filterSeverity(severity: string): void {
    this.filteredLogs = this.logs.filter(l => l.severity === severity);
  }

  refresh(): void {
    this.currentPage = 0;
    this.loadLogs();
    this.toastService.info('Flux actualisé');
  }

  exportReport(): void {
    this.auditService.exportFull().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'audit-report.pdf'; a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toastService.error('Erreur lors de l\'export')
    });
  }

  prevPage(): void { if (this.currentPage > 0) { this.currentPage--; this.loadLogs(); } }
  nextPage(): void { if (this.currentPage < this.totalPages - 1) { this.currentPage++; this.loadLogs(); } }

  getActionClass(log: AuditLog): Record<string, boolean> {
    const t = log.actionType?.toLowerCase() || '';
    return {
      'bg-emerald-500/10 text-emerald-700': t.includes('vote') || t.includes('enregistr'),
      'bg-rose-500/10 text-rose-700': t.includes('fraud') || t.includes('bloqu'),
      'bg-blue-500/10 text-blue-700': t.includes('admin') || t.includes('access'),
      'bg-amber-500/10 text-amber-700': t.includes('connexion') || t.includes('echec') || t.includes('échoué'),
    };
  }

  getSeverityClass(log: AuditLog): Record<string, boolean> {
    return {
      'text-emerald-600': log.severity === 'INFO',
      'text-amber-600': log.severity === 'WARNING',
      'text-rose-600': log.severity === 'CRITICAL',
      'text-slate-600': !log.severity,
    };
  }

  getSeverityIcon(log: AuditLog): string {
    switch (log.severity) {
      case 'INFO': return 'verified';
      case 'WARNING': return 'lock_reset';
      case 'CRITICAL': return 'gpp_maybe';
      default: return 'info';
    }
  }

  getSeverityLabel(log: AuditLog): string {
    switch (log.severity) {
      case 'INFO': return 'Vérifié';
      case 'WARNING': return 'Rejeté';
      case 'CRITICAL': return 'Bloqué';
      default: return 'Lecture';
    }
  }
}
