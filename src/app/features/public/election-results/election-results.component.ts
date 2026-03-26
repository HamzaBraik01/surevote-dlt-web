import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ElectionResult, CandidatResult } from '../../../core/models';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  template: `
    <!-- Navbar -->
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">shield_lock</span>
          <span class="text-xl font-black tracking-tighter text-primary">SUREVOTE</span>
        </a>
        <div class="flex items-center gap-4">
          <button (click)="toggleDark()" class="p-2 rounded-xl hover:bg-surface-container-high transition-colors" title="Changer le thème">
            <span class="material-symbols-outlined text-on-surface-variant text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <a routerLink="/elections" class="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">arrow_back</span> Toutes les élections
          </a>
        </div>
      </div>
    </header>

    <main class="pt-20 min-h-screen bg-surface">
      <!-- Loading -->
      @if (loading) {
        <div class="flex justify-center items-center py-40">
          <div class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      }

      <!-- Results Content -->
      @else if (results) {
        <!-- Hero Header -->
        <section class="relative py-16 md:py-20 overflow-hidden">
          <div class="absolute inset-0 hero-gradient opacity-[0.04]"></div>
          <div class="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
          <div class="max-w-5xl mx-auto px-6 relative z-10">
            <div class="flex items-center gap-2 mb-4">
              <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">ballot</span>
              <span class="text-xs font-bold uppercase tracking-widest text-primary">Résultats officiels</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">{{ results.titre }}</h1>
            <p class="text-on-surface-variant text-lg">Résultats finaux et classement des candidats.</p>
          </div>
        </section>

        <!-- Stats Summary Cards -->
        <section class="pb-10">
          <div class="max-w-5xl mx-auto px-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 text-center">
                <span class="material-symbols-outlined text-primary text-2xl mb-2" style="font-variation-settings: 'FILL' 1;">how_to_vote</span>
                <p class="text-2xl font-black text-on-surface">{{ results.totalVotes }}</p>
                <p class="text-xs text-on-surface-variant font-medium mt-1">Votes exprimés</p>
              </div>
              <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 text-center">
                <span class="material-symbols-outlined text-emerald-600 text-2xl mb-2" style="font-variation-settings: 'FILL' 1;">trending_up</span>
                <p class="text-2xl font-black text-on-surface">{{ results.tauxParticipation | number:'1.1-1' }}%</p>
                <p class="text-xs text-on-surface-variant font-medium mt-1">Participation</p>
              </div>
              <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 text-center">
                <span class="material-symbols-outlined text-amber-600 text-2xl mb-2" style="font-variation-settings: 'FILL' 1;">group</span>
                <p class="text-2xl font-black text-on-surface">{{ results.resultats.length }}</p>
                <p class="text-xs text-on-surface-variant font-medium mt-1">Candidats</p>
              </div>
              <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 text-center">
                <span class="material-symbols-outlined text-blue-600 text-2xl mb-2" style="font-variation-settings: 'FILL' 1;">block</span>
                <p class="text-2xl font-black text-on-surface">{{ results.voteBlanc || 0 }}</p>
                <p class="text-xs text-on-surface-variant font-medium mt-1">Votes blancs</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Winner Highlight -->
        @if (winner) {
          <section class="pb-10">
            <div class="max-w-5xl mx-auto px-6">
              <div class="relative bg-surface-container-lowest rounded-2xl border border-primary/20 overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 hero-gradient"></div>
                <div class="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                  <!-- Winner Avatar -->
                  <div class="relative shrink-0">
                    <div class="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-fixed to-surface-container-low flex items-center justify-center text-4xl font-black text-primary/30">
                      {{ winner.prenom[0] }}{{ winner.nom[0] }}
                    </div>
                    <div class="absolute -top-3 -right-3 w-10 h-10 hero-gradient rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                      <span class="material-symbols-outlined text-white text-lg" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
                    </div>
                  </div>
                  <!-- Winner Info -->
                  <div class="flex-1 text-center md:text-left">
                    <div class="inline-flex items-center gap-2 bg-primary-fixed/30 text-primary px-3 py-1 rounded-full mb-3">
                      <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
                      <span class="text-[10px] font-bold uppercase tracking-widest">Élu</span>
                    </div>
                    <h2 class="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">{{ winner.prenom }} {{ winner.nom }}</h2>
                    <p class="text-on-surface-variant font-medium mb-4">{{ winner.affiliationOuParti || 'Indépendant' }}</p>
                    <div class="flex flex-wrap justify-center md:justify-start gap-6">
                      <div>
                        <p class="text-3xl font-black text-primary">{{ winner.pourcentage | number:'1.1-1' }}%</p>
                        <p class="text-xs text-on-surface-variant font-medium">des votes</p>
                      </div>
                      <div class="w-px bg-outline-variant/20 hidden sm:block"></div>
                      <div>
                        <p class="text-3xl font-black text-on-surface">{{ winner.nombreVoix }}</p>
                        <p class="text-xs text-on-surface-variant font-medium">voix obtenues</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }

        <!-- Full Results with Progress Bars -->
        <section class="pb-20">
          <div class="max-w-5xl mx-auto px-6">
            <div class="flex items-center gap-2 mb-6">
              <span class="material-symbols-outlined text-on-surface-variant">leaderboard</span>
              <h3 class="text-lg font-bold text-on-surface">Classement complet</h3>
            </div>

            <div class="space-y-3">
              @for (c of results.resultats; track c.candidatId; let i = $index) {
                <div class="bg-surface-container-lowest rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-md"
                     [class]="i === 0 ? 'border-primary/20' : 'border-outline-variant/10'">
                  <div class="p-5 md:p-6">
                    <div class="flex items-center gap-4 md:gap-6">
                      <!-- Rank -->
                      <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-sm md:text-base font-black shrink-0 transition-transform"
                           [class]="getRankStyle(i)">
                        @if (i === 0) {
                          <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">emoji_events</span>
                        } @else {
                          {{ i + 1 }}
                        }
                      </div>

                      <!-- Candidate Info + Progress Bar -->
                      <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <div class="min-w-0">
                            <p class="font-bold text-on-surface truncate">{{ c.prenom }} {{ c.nom }}</p>
                            <p class="text-xs text-on-surface-variant">{{ c.affiliationOuParti || 'Indépendant' }}</p>
                          </div>
                          <div class="flex items-center gap-3 shrink-0">
                            <span class="text-xs text-on-surface-variant font-medium">{{ c.nombreVoix }} voix</span>
                            <span class="text-xl md:text-2xl font-black" [class]="i === 0 ? 'text-primary' : 'text-on-surface'">{{ c.pourcentage | number:'1.1-1' }}%</span>
                          </div>
                        </div>
                        <!-- Progress Bar -->
                        <div class="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-1000 ease-out"
                               [class]="getBarColor(i)"
                               [style.width.%]="c.pourcentage">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              <!-- Blank Votes -->
              @if (results.voteBlanc && results.voteBlanc > 0) {
                <div class="bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/20 p-5 md:p-6">
                  <div class="flex items-center gap-4 md:gap-6">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-outline text-lg">block</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                        <div>
                          <p class="font-bold text-on-surface-variant">Votes blancs</p>
                          <p class="text-xs text-outline">Expression de neutralité</p>
                        </div>
                        <div class="flex items-center gap-3 shrink-0">
                          <span class="text-xs text-on-surface-variant font-medium">{{ results.voteBlanc }} voix</span>
                          <span class="text-xl md:text-2xl font-black text-on-surface-variant">{{ getBlankPercentage() | number:'1.1-1' }}%</span>
                        </div>
                      </div>
                      <div class="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div class="h-full rounded-full bg-outline/30 transition-all duration-1000 ease-out"
                             [style.width.%]="getBlankPercentage()">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Back Button -->
            <div class="mt-10 flex justify-center">
              <a routerLink="/elections" class="px-8 py-3.5 bg-surface-container-lowest text-on-surface font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-all flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">arrow_back</span> Voir toutes les élections
              </a>
            </div>
          </div>
        </section>
      }

      <!-- Error State -->
      @else {
        <div class="text-center py-32 text-on-surface-variant">
          <span class="material-symbols-outlined text-6xl mb-4">error</span>
          <p class="text-xl font-bold text-on-surface mb-2">Résultats non disponibles</p>
          <p class="text-on-surface-variant mb-8">Les résultats de cette élection ne sont pas encore publiés ou une erreur est survenue.</p>
          <a routerLink="/elections" class="px-6 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all inline-flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">arrow_back</span> Retour aux élections
          </a>
        </div>
      }

      <app-footer />
    </main>
  `
})
export class ElectionResultsComponent implements OnInit {
  results: ElectionResult | null = null;
  loading = true;
  winner: CandidatResult | null = null;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  get isDark() { return this.themeService.isDark; }
  toggleDark(): void { this.themeService.toggle(); }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.electionService.getPublicResults(id).subscribe({
      next: (data) => {
        this.results = data;
        if (data.resultats && data.resultats.length > 0) {
          this.winner = data.resultats[0];
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  getRankStyle(index: number): string {
    switch (index) {
      case 0: return 'hero-gradient text-white shadow-lg shadow-primary/20';
      case 1: return 'bg-surface-container-high text-on-surface';
      case 2: return 'bg-surface-container-high text-on-surface';
      default: return 'bg-surface-container-low text-on-surface-variant';
    }
  }

  getBarColor(index: number): string {
    switch (index) {
      case 0: return 'hero-gradient';
      case 1: return 'bg-emerald-500';
      case 2: return 'bg-amber-500';
      default: return 'bg-surface-variant';
    }
  }

  getBlankPercentage(): number {
    if (!this.results || !this.results.voteBlanc || !this.results.totalVotes) return 0;
    return (this.results.voteBlanc / this.results.totalVotes) * 100;
  }
}
