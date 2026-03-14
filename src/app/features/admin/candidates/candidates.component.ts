import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidatService } from '../../../core/services/candidat.service';
import { ElectionService } from '../../../core/services/election.service';
import { FileService } from '../../../core/services/file.service';
import { ToastService } from '../../../core/services/toast.service';
import { Candidat, Election } from '../../../core/models';

@Component({
  selector: 'app-admin-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <header class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-on-surface">Gestion des Candidats</h1>
        <p class="text-on-surface-variant mt-1 text-sm">Vue globale de tous les candidats inscrits.</p>
      </div>
    </header>

    <!-- Filter Bar -->
    <div class="bg-surface-container-lowest p-4 rounded-xl mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px] relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
        <input [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Rechercher un candidat..."
          class="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl border-transparent text-sm focus:ring-2 focus:ring-primary outline-none" />
      </div>
      <select [(ngModel)]="selectedElectionId" (change)="loadCandidates()" class="px-4 py-2.5 bg-surface rounded-xl border-transparent text-sm focus:ring-2 focus:ring-primary outline-none">
        <option [value]="0">Toutes les élections</option>
        @for (e of elections; track e.id) {
          <option [value]="e.id">{{ e.titre }}</option>
        }
      </select>
    </div>

    <!-- Candidates Grid -->
    @if (loading) {
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else if (filteredCandidates.length === 0) {
      <div class="text-center py-16 bg-surface-container-lowest rounded-xl text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl mb-4">person_search</span>
        <p class="font-medium">Aucun candidat trouvé.</p>
      </div>
    } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (c of filteredCandidates; track c.id) {
          <div class="bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-sm transition-all group">
            <div class="h-40 bg-gradient-to-br from-primary-fixed to-surface-container-low flex items-center justify-center relative overflow-hidden">
              @if (c.photoUrl) {
                <img [src]="getPhotoUrl(c.photoUrl)" [alt]="c.prenom + ' ' + c.nom" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              } @else {
                <div class="w-20 h-20 rounded-full bg-surface-container-lowest/90 flex items-center justify-center text-primary text-2xl font-black">
                  {{ c.prenom[0] }}{{ c.nom[0] }}
                </div>
              }
              @if (c.affiliationOuParti) {
                <div class="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full">
                  <span class="text-[10px] font-bold tracking-widest text-primary uppercase">{{ c.affiliationOuParti }}</span>
                </div>
              }
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-on-surface mb-1">{{ c.prenom }} {{ c.nom }}</h3>
              <p class="text-xs text-on-surface-variant mb-3">Élection #{{ c.electionId }}</p>
              <p class="text-sm text-on-surface-variant line-clamp-2 mb-4">{{ c.biographie || 'Aucune biographie.' }}</p>
              <div class="flex gap-2">
                <a [routerLink]="['/admin/elections', c.electionId]"
                  class="flex-1 py-2 bg-surface-container-high text-on-secondary-container text-center text-xs font-bold rounded-xl hover:bg-surface-variant transition-colors">
                  Voir élection
                </a>
                @if (c.programmePdfUrl) {
                  <a [href]="getFileUrl(c.programmePdfUrl!)" target="_blank"
                    class="py-2 px-3 bg-primary-fixed text-primary text-xs font-bold rounded-xl hover:bg-primary-fixed-dim transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">description</span> PDF
                  </a>
                }
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class AdminCandidatesComponent implements OnInit {
  elections: Election[] = [];
  allCandidates: Candidat[] = [];
  filteredCandidates: Candidat[] = [];
  searchQuery = '';
  selectedElectionId = 0;
  loading = true;

  constructor(
    private candidatService: CandidatService,
    private electionService: ElectionService,
    private fileService: FileService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.electionService.list().subscribe({
      next: (d) => { this.elections = d; this.loadAllCandidates(); },
      error: () => { this.loading = false; }
    });
  }

  loadAllCandidates(): void {
    this.loading = true;
    this.allCandidates = [];
    let pending = this.elections.length;
    if (pending === 0) { this.loading = false; this.cdr.markForCheck(); return; }
    this.elections.forEach(e => {
      this.candidatService.listByElection(e.id).subscribe({
        next: (candidates) => {
          candidates.forEach(c => (c as any).electionId = e.id);
          this.allCandidates.push(...candidates);
          pending--;
          if (pending === 0) { this.filteredCandidates = [...this.allCandidates]; this.loading = false; this.cdr.markForCheck(); }
        },
        error: () => { pending--; if (pending === 0) { this.loading = false; this.cdr.markForCheck(); } }
      });
    });
  }

  loadCandidates(): void {
    if (this.selectedElectionId == 0) {
      this.filteredCandidates = [...this.allCandidates];
    } else {
      this.filteredCandidates = this.allCandidates.filter((c: any) => c.electionId == this.selectedElectionId);
    }
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    let pool = this.selectedElectionId == 0 ? this.allCandidates : this.allCandidates.filter((c: any) => c.electionId == this.selectedElectionId);
    this.filteredCandidates = pool.filter(c => `${c.prenom} ${c.nom} ${c.affiliationOuParti}`.toLowerCase().includes(q));
  }

  getPhotoUrl(path: string): string { return this.fileService.getDownloadUrl(path); }
  getFileUrl(path: string): string { return this.fileService.getDownloadUrl(path); }
}
