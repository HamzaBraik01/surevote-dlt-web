import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Election } from '../../../core/models';
import { timeout } from 'rxjs';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-public-elections',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-black tracking-tighter text-primary">SUREVOTE</a>
        <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="md:hidden p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined text-on-surface">{{ mobileMenuOpen() ? 'close' : 'menu' }}</span>
        </button>
        <nav class="hidden md:flex items-center gap-6">
          <button (click)="toggleDark()" class="p-2 rounded-xl hover:bg-surface-container-high transition-colors" title="Changer le thème">
            <span class="material-symbols-outlined text-on-surface-variant text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <a routerLink="/auth/login" class="text-sm font-semibold text-primary hover:underline">Connexion</a>
          <a routerLink="/auth/register" class="px-5 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg hover:opacity-90 transition-all">S'inscrire</a>
        </nav>
      </div>
      @if (mobileMenuOpen()) {
        <div class="md:hidden bg-surface-container-lowest border-t border-outline-variant/10 px-6 py-4 space-y-3">
          <button (click)="toggleDark()" class="w-full text-left text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
            {{ isDark() ? 'Mode clair' : 'Mode sombre' }}
          </button>
          <a routerLink="/auth/login" (click)="mobileMenuOpen.set(false)" class="block text-sm font-semibold text-primary py-2">Connexion</a>
          <a routerLink="/auth/register" (click)="mobileMenuOpen.set(false)" class="block text-center px-5 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg">S'inscrire</a>
        </div>
      }
    </header>

    <main class="pt-24 pb-16 min-h-screen bg-surface">
      <div class="max-w-6xl mx-auto px-6">
        <h1 class="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Élections Publiques</h1>
        <p class="text-on-surface-variant text-lg mb-10">Consultez les scrutins ouverts et leurs résultats.</p>

        @if (loading) {
          <div class="flex justify-center py-20">
            <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        } @else if (elections.length === 0) {
          <div class="text-center py-20 text-on-surface-variant">
            <span class="material-symbols-outlined text-6xl mb-4">how_to_vote</span>
            <p class="text-lg font-semibold">Aucune élection disponible pour le moment.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (e of elections; track e.id) {
              <div class="bg-surface-container-lowest rounded-xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-bold text-on-surface leading-tight">{{ e.titre }}</h3>
                  <app-status-badge [status]="e.statut" [pulse]="e.statut === 'OUVERTE'" />
                </div>
                <p class="text-sm text-on-surface-variant mb-4 line-clamp-3">{{ e.description }}</p>
                <div class="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
                  <span class="material-symbols-outlined text-sm">calendar_today</span>
                  <span class="font-semibold">{{ e.dateDebut | date:'dd MMM yyyy' }} — {{ e.dateFin | date:'dd MMM yyyy' }}</span>
                </div>
                @if (e.statut === 'PUBLIEE' || e.statut === 'CLOTUREE') {
                  <a [routerLink]="['/elections', e.id, 'results']"
                    class="w-full bg-surface-container-high text-on-secondary-container font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors">
                    Voir les résultats <span class="material-symbols-outlined text-sm">visibility</span>
                  </a>
                } @else if (e.statut === 'OUVERTE') {
                  <a routerLink="/auth/login"
                    class="w-full hero-gradient text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
                    Voter maintenant <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                }
              </div>
            }
          </div>
        }
      </div>
    </main>
  `
})
export class PublicElectionsComponent implements OnInit {
  elections: Election[] = [];
  loading = true;
  mobileMenuOpen = signal(false);

  constructor(private electionService: ElectionService, private toastService: ToastService, private themeService: ThemeService, private cdr: ChangeDetectorRef) {}

  get isDark() { return this.themeService.isDark; }
  toggleDark(): void { this.themeService.toggle(); }

  ngOnInit(): void {
    this.electionService.listVisible().pipe(timeout(15000)).subscribe({
      next: (data) => { this.elections = data; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); this.toastService.error('Impossible de charger les élections. Vérifiez votre connexion.'); }
    });
  }
}
