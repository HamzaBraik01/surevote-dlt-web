import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectionService } from '../../../core/services/election.service';
import { CollegeService } from '../../../core/services/college.service';
import { ToastService } from '../../../core/services/toast.service';
import { Election, CollegeElectoral, PageResponse } from '../../../core/models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, StatusBadgeComponent, ConfirmModalComponent],
  template: `
    @if (loading) {
      <div class="flex justify-center py-20">
        <div class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else {
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
      <div>
        <h1 class="text-3xl font-extrabold text-on-surface tracking-tight">Gestion des Élections</h1>
        <p class="text-on-surface-variant mt-1 font-medium">Contrôle centralisé du processus démocratique</p>
      </div>
      <button (click)="showModal = true"
        class="hero-gradient text-white px-8 py-4 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
        <span class="material-symbols-outlined">add_circle</span>
        <span>Nouvelle Élection</span>
      </button>
    </header>

    <!-- Stats Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined">groups</span>
          </div>
        </div>
        <p class="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Total Élections</p>
        <h2 class="text-4xl font-black text-on-surface mt-1">{{ totalElements }}</h2>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="h-12 w-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined">how_to_reg</span>
          </div>
        </div>
        <p class="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Élections actives</p>
        <h2 class="text-4xl font-black text-on-surface mt-1">{{ activeCount }}</h2>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="h-12 w-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined">analytics</span>
          </div>
        </div>
        <p class="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">Brouillons</p>
        <h2 class="text-4xl font-black text-on-surface mt-1">{{ draftCount }}</h2>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
      <div class="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest border-b border-outline-variant/10">
        <div class="relative w-72">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">search</span>
          <input [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Rechercher une élection..."
            class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm outline-none" />
        </div>
        <div class="flex space-x-3">
          <select [(ngModel)]="filterStatus" (change)="onFilterChange()" class="px-4 py-2 bg-surface-container-high rounded-xl text-sm font-bold border-none focus:ring-0">
            <option value="">Tous les statuts</option>
            <option value="BROUILLON">Brouillon</option>
            <option value="PLANIFIEE">Planifiée</option>
            <option value="OUVERTE">Ouverte</option>
            <option value="CLOTUREE">Clôturée</option>
            <option value="PUBLIEE">Publiée</option>
          </select>
          <button (click)="exportElections()" class="px-4 py-2 bg-surface-container-high text-on-secondary-container rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-surface-variant transition-colors">
            <span class="material-symbols-outlined text-sm">download</span><span>Exporter</span>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
      <table class="w-full border-collapse min-w-[600px]">
        <thead>
          <tr class="text-left bg-surface-container-low">
            <th class="px-6 py-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Titre</th>
            <th class="px-6 py-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Période</th>
            <th class="px-6 py-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest">Statut</th>
            <th class="px-6 py-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/10">
          @for (e of elections; track e.id) {
            <tr class="hover:bg-surface-container-low/50 transition-colors">
              <td class="px-6 py-5">
                <a [routerLink]="['/admin/elections', e.id]" class="font-bold text-on-surface hover:text-primary transition-colors">{{ e.titre }}</a>
                <p class="text-xs text-on-surface-variant">ID: #{{ e.id }}</p>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center space-x-2 text-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-sm">calendar_today</span>
                  <span>{{ e.dateDebut | date:'dd MMM' }} - {{ e.dateFin | date:'dd MMM yyyy' }}</span>
                </div>
              </td>
              <td class="px-6 py-5"><app-status-badge [status]="e.statut" /></td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-1">
                  @if (e.statut === 'BROUILLON') {
                    <button (click)="transition(e, 'plan')" title="Planifier" class="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                      <span class="material-symbols-outlined text-sm text-amber-600">schedule</span>
                    </button>
                  }
                  @if (e.statut === 'PLANIFIEE') {
                    <button (click)="transition(e, 'open')" title="Ouvrir" class="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                      <span class="material-symbols-outlined text-sm text-emerald-600">play_arrow</span>
                    </button>
                  }
                  @if (e.statut === 'OUVERTE') {
                    <button (click)="transition(e, 'close')" title="Clôturer" class="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                      <span class="material-symbols-outlined text-sm text-rose-600">stop</span>
                    </button>
                  }
                  @if (e.statut === 'CLOTUREE') {
                    <button (click)="transition(e, 'publish')" title="Publier" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <span class="material-symbols-outlined text-sm text-primary">publish</span>
                    </button>
                  }
                  @if (e.statut === 'BROUILLON') {
                    <button (click)="confirmDelete(e)" title="Supprimer" class="p-2 hover:bg-rose-50 rounded-lg transition-colors">
                      <span class="material-symbols-outlined text-sm text-rose-600">delete</span>
                    </button>
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10">
        <p class="text-sm text-on-surface-variant font-medium">Page {{ currentPage + 1 }} sur {{ totalPages || 1 }} · {{ totalElements }} élections</p>
        <div class="flex space-x-2">
          <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
            class="p-2 bg-surface-container-high rounded-lg disabled:opacity-40 hover:bg-surface-container-highest transition-colors">
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
            class="p-2 bg-primary text-white rounded-lg disabled:opacity-40 hover:opacity-90 transition-colors">
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    @if (showModal) {
      <div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="showModal = false">
        <div class="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg whisper-shadow" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-on-surface mb-6">Nouvelle Élection</h2>
          <form [formGroup]="createForm" (ngSubmit)="createElection()" class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Titre</label>
              <input formControlName="titre" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
              @if (createForm.get('titre')?.touched && createForm.get('titre')?.errors?.['required']) {
                <p class="text-xs text-error font-medium">Le titre est requis</p>
              }
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Description</label>
              <textarea formControlName="description" rows="3" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date Début</label>
                <input formControlName="dateDebut" type="datetime-local" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date Fin</label>
                <input formControlName="dateFin" type="datetime-local" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Collège Électoral (optionnel)</label>
              <select formControlName="collegeElectoralId" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none">
                <option [value]="null">— Aucun —</option>
                @for (c of colleges; track c.id) {
                  <option [value]="c.id">{{ c.nom }}</option>
                }
              </select>
            </div>
            <div class="flex gap-4 pt-4">
              <button type="button" (click)="showModal = false" class="flex-1 py-3 bg-surface-container-high text-on-secondary-container font-bold rounded-xl">Annuler</button>
              <button type="submit" [disabled]="createForm.invalid" class="flex-1 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg disabled:opacity-50">Créer</button>
            </div>
          </form>
        </div>
      </div>
    }
    }

    <!-- Delete Confirm -->
    <app-confirm-modal
      [visible]="deleteTarget !== null"
      title="Supprimer l'élection"
      [message]="'Supprimer définitivement &quot;' + (deleteTarget?.titre || '') + '&quot; ? Cette action est irréversible.'"
      confirmText="Supprimer"
      type="danger"
      (confirmed)="doDelete()"
      (cancelled)="deleteTarget = null"
    ></app-confirm-modal>
  `
})
export class ElectionsComponent implements OnInit {
  elections: Election[] = [];
  colleges: CollegeElectoral[] = [];
  searchQuery = '';
  filterStatus = '';
  showModal = false;
  deleteTarget: Election | null = null;
  createForm: FormGroup;
  loading = true;

  currentPage = 0;
  totalPages = 1;
  totalElements = 0;
  activeCount = 0;
  draftCount = 0;

  constructor(
    private electionService: ElectionService,
    private collegeService: CollegeService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      collegeElectoralId: [null]
    });
  }

  ngOnInit(): void {
    this.loadPage(0);
    this.collegeService.list().subscribe({ next: (c) => this.colleges = c, error: () => {} });
  }

  loadPage(page: number): void {
    this.loading = true;
    console.log('[ElectionsComponent] loadPage started, page:', page);
    this.electionService.listPaged(page, 10).subscribe({
      next: (res: PageResponse<Election>) => {
        console.log('[ElectionsComponent] loadPage success:', JSON.stringify(res).substring(0, 200));
        this.elections = res.content;
        this.currentPage = res.number;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.activeCount = res.content.filter(e => e.statut === 'OUVERTE' || e.statut === 'PLANIFIEE').length;
        this.draftCount = res.content.filter(e => e.statut === 'BROUILLON').length;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => { console.error('[ElectionsComponent] loadPage error:', err); this.loading = false; this.cdr.markForCheck(); }
    });
  }

  goToPage(p: number): void { if (p >= 0 && p < this.totalPages) this.loadPage(p); }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.electionService.search(this.searchQuery).subscribe({ next: (d) => this.elections = d });
    } else {
      this.loadPage(0);
    }
  }

  onFilterChange(): void {
    if (this.filterStatus) {
      this.electionService.filterByStatus(this.filterStatus).subscribe({ next: (d) => this.elections = d });
    } else {
      this.loadPage(0);
    }
  }

  createElection(): void {
    if (this.createForm.invalid) return;
    const val = this.createForm.value;
    this.electionService.create({
      titre: val.titre, description: val.description,
      dateDebut: val.dateDebut, dateFin: val.dateFin,
      collegeElectoralId: val.collegeElectoralId ? Number(val.collegeElectoralId) : null
    }).subscribe({
      next: () => { this.toastService.success('Élection créée'); this.showModal = false; this.createForm.reset(); this.loadPage(0); },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }

  transition(e: Election, action: string): void {
    const fn = action === 'plan' ? this.electionService.plan(e.id)
      : action === 'open' ? this.electionService.open(e.id)
      : action === 'close' ? this.electionService.close(e.id)
      : this.electionService.publish(e.id);
    fn.subscribe({
      next: () => { this.toastService.success('Statut mis à jour'); this.loadPage(this.currentPage); },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }

  confirmDelete(e: Election): void { this.deleteTarget = e; }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.electionService.delete(this.deleteTarget.id).subscribe({
      next: () => { this.toastService.success('Élection supprimée'); this.deleteTarget = null; this.loadPage(this.currentPage); },
      error: () => { this.toastService.error('Erreur'); this.deleteTarget = null; }
    });
  }

  exportElections(): void {
    const escape = (val: string | number | null): string => {
      const s = String(val ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = this.elections.map(e =>
      [e.id, escape(e.titre), escape(e.statut), e.dateDebut, e.dateFin].join(',')
    ).join('\n');
    const blob = new Blob([`ID,Titre,Statut,Début,Fin\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'elections.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
