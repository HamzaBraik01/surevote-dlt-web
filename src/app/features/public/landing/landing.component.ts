import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { VoteService } from '../../../core/services/vote.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Election } from '../../../core/models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  template: `
    <!-- Public Navbar -->
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-black tracking-tighter text-primary">SUREVOTE</a>
        <!-- Mobile hamburger -->
        <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="md:hidden p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined text-on-surface">{{ mobileMenuOpen() ? 'close' : 'menu' }}</span>
        </button>
        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center space-x-6">
          <button (click)="toggleDark()" class="p-2 rounded-xl hover:bg-surface-container-high transition-colors" title="Changer le thème">
            <span class="material-symbols-outlined text-on-surface-variant text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <a routerLink="/elections" class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Élections</a>
          <a routerLink="/auth/login" class="text-sm font-semibold text-primary hover:underline">Connexion</a>
          <a routerLink="/auth/register" class="px-5 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
            S'inscrire
          </a>
        </nav>
      </div>
      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden bg-surface-container-lowest border-t border-outline-variant/10 px-6 py-4 space-y-3">
          <button (click)="toggleDark()" class="w-full text-left text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
            {{ isDark() ? 'Mode clair' : 'Mode sombre' }}
          </button>
          <a routerLink="/elections" (click)="mobileMenuOpen.set(false)" class="block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2">Élections</a>
          <a routerLink="/auth/login" (click)="mobileMenuOpen.set(false)" class="block text-sm font-semibold text-primary hover:underline py-2">Connexion</a>
          <a routerLink="/auth/register" (click)="mobileMenuOpen.set(false)" class="block text-center px-5 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg">S'inscrire</a>
        </div>
      }
    </header>

    <main class="pt-20 min-h-screen bg-surface">
      <!-- Hero -->
      <section class="relative py-24 md:py-32 overflow-hidden">
        <div class="absolute inset-0 hero-gradient opacity-[0.03]"></div>
        <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div class="inline-flex items-center gap-2 bg-primary-fixed/30 text-primary px-4 py-2 rounded-full mb-8">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-widest">Plateforme de Vote Souverain</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-on-surface mb-6 leading-tight">
            Votez en toute<br/><span class="text-primary">confiance.</span>
          </h1>
          <p class="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Une infrastructure de vote électronique de pointe, conçue pour garantir la transparence, la sécurité et l'intégrité de chaque scrutin.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/auth/register" class="px-8 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
              Commencer <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </a>
            <a routerLink="/elections" class="px-8 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-all flex items-center gap-2">
              Voir les élections <span class="material-symbols-outlined text-lg">ballot</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Verify Receipt Section -->
      <section class="py-16 bg-surface-container-low">
        <div class="max-w-3xl mx-auto px-6 text-center">
          <h2 class="text-2xl font-bold text-on-surface mb-2">Vérifiez votre reçu de vote</h2>
          <p class="text-on-surface-variant text-sm mb-8">Entrez votre identifiant cryptographique pour vérifier l'enregistrement de votre vote.</p>
          <div class="flex gap-3 max-w-xl mx-auto">
            <div class="flex-1 relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">tag</span>
              <input [(ngModel)]="receiptCode" placeholder="Ex: VOTE-7829-XKCD-3FA2"
                class="w-full pl-11 pr-4 py-4 bg-surface-container-lowest border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
            </div>
            <button (click)="verifyReceipt()" class="px-6 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">verified</span> Vérifier
            </button>
          </div>
          @if (receiptResult !== null) {
            <div class="mt-6 p-4 rounded-xl" [class]="receiptResult ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'">
              <div class="flex items-center justify-center gap-2">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{{ receiptResult ? 'check_circle' : 'cancel' }}</span>
                <span class="font-semibold text-sm">{{ receiptResult ? 'Vote vérifié avec succès !' : 'Reçu non trouvé.' }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Published Elections -->
      <section class="py-16">
        <div class="max-w-6xl mx-auto px-6">
          <h2 class="text-2xl font-bold text-on-surface mb-2">Résultats Publiés</h2>
          <p class="text-on-surface-variant text-sm mb-8">Consultez les résultats des scrutins terminés.</p>

          @if (publishedElections.length === 0) {
            <div class="text-center py-16 text-on-surface-variant">
              <span class="material-symbols-outlined text-5xl mb-4">ballot</span>
              <p class="font-medium">Aucun résultat publié pour le moment.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (e of publishedElections; track e.id) {
                <div class="bg-surface-container-lowest rounded-xl p-6 hover:translate-y-[-4px] transition-all duration-300">
                  <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-bold text-on-surface leading-tight">{{ e.titre }}</h3>
                    <app-status-badge [status]="e.statut" />
                  </div>
                  <p class="text-sm text-on-surface-variant mb-4 line-clamp-2">{{ e.description }}</p>
                  <a [routerLink]="['/elections', e.id, 'results']"
                    class="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
                    Voir les résultats <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 border-t border-outline-variant/10">
        <div class="max-w-6xl mx-auto px-6 text-center text-on-surface-variant text-sm">
          <p class="font-bold text-primary mb-2">SUREVOTE</p>
          <p>© 2026 Système de Vote Électronique Sécurisé. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  `
})
export class LandingComponent implements OnInit {
  receiptCode = '';
  receiptResult: boolean | null = null;
  receiptLoading = false;
  publishedElections: Election[] = [];
  mobileMenuOpen = signal(false);

  constructor(
    private electionService: ElectionService,
    private voteService: VoteService,
    private toastService: ToastService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPublished();
  }

  loadPublished(): void {
    this.electionService.publishedElections().subscribe({
      next: (data) => { this.publishedElections = data; this.cdr.markForCheck(); },
      error: () => this.toastService.error('Impossible de charger les élections')
    });
  }

  get isDark() { return this.themeService.isDark; }
  toggleDark(): void { this.themeService.toggle(); }

  verifyReceipt(): void {
    if (!this.receiptCode.trim()) {
      this.toastService.warning('Veuillez entrer un identifiant de reçu');
      return;
    }
    this.receiptLoading = true;
    this.receiptResult = null;
    this.voteService.verifyReceipt(this.receiptCode.trim()).subscribe({
      next: (res) => {
        this.receiptResult = res.valid;
        this.receiptLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.receiptResult = false;
        this.receiptLoading = false;
        this.cdr.markForCheck();
        this.toastService.error('Erreur lors de la vérification');
      }
    });
  }
}
