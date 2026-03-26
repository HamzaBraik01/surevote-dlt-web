import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ElectionResult } from '../../../core/models';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  template: `
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">shield_lock</span>
          <span class="text-xl font-black tracking-tighter text-primary">SUREVOTE</span>
        </a>
        <button (click)="toggleDark()" class="p-2 rounded-xl hover:bg-surface-container-high transition-colors" title="Changer le thème">
          <span class="material-symbols-outlined text-on-surface-variant text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <a routerLink="/elections" class="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">arrow_back</span> Retour
        </a>
      </div>
    </header>

    <main class="pt-24 pb-16 min-h-screen bg-surface">
      <div class="max-w-4xl mx-auto px-6">
        @if (loading) {
          <div class="flex justify-center py-20">
            <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        } @else if (results) {
          <h1 class="text-3xl font-bold tracking-tight text-on-surface mb-2">{{ results.titre }}</h1>
          <div class="flex items-center gap-6 text-sm text-on-surface-variant mb-10">
            <span><strong class="text-on-surface">{{ results.totalVotes }}</strong> votes exprimés</span>
            <span><strong class="text-on-surface">{{ results.tauxParticipation | number:'1.1-1' }}%</strong> de participation</span>
          </div>

          <div class="space-y-4">
            @for (c of results.resultats; track c.candidatId; let i = $index) {
              <div class="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-6">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
                  [class]="i === 0 ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface'">
                  {{ i + 1 }}
                </div>
                <div class="flex-1">
                  <p class="font-bold text-on-surface">{{ c.prenom }} {{ c.nom }}</p>
                  <p class="text-xs text-on-surface-variant">{{ c.affiliationOuParti }}</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-black" [class]="i === 0 ? 'text-primary' : 'text-on-surface'">{{ c.pourcentage | number:'1.1-1' }}%</p>
                  <p class="text-xs text-on-surface-variant">{{ c.nombreVoix }} voix</p>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-20 text-on-surface-variant">
            <span class="material-symbols-outlined text-6xl mb-4">error</span>
            <p class="text-lg font-semibold">Résultats non disponibles.</p>
          </div>
        }
      </div>
    </main>
    <app-footer />
  `
})
export class ElectionResultsComponent implements OnInit {
  results: ElectionResult | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private electionService: ElectionService, private themeService: ThemeService, private cdr: ChangeDetectorRef) {}

  get isDark() { return this.themeService.isDark; }
  toggleDark(): void { this.themeService.toggle(); }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.electionService.getPublicResults(id).subscribe({
      next: (data) => { this.results = data; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }
}
