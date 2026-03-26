import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-faq',
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
        <nav class="hidden md:flex items-center space-x-6">
          <a routerLink="/elections" class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Élections</a>
          <a routerLink="/faq" class="text-sm font-semibold text-primary">FAQ</a>
          <a routerLink="/contact" class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Contact</a>
          <button (click)="toggleDark()" class="p-2 rounded-xl hover:bg-surface-container-high transition-colors" title="Changer le thème">
            <span class="material-symbols-outlined text-on-surface-variant text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <a routerLink="/auth/login" class="text-sm font-semibold text-primary hover:underline">Connexion</a>
          <a routerLink="/auth/register" class="px-5 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">S'inscrire</a>
        </nav>
      </div>
    </header>

    <main class="pt-20 bg-surface min-h-screen">
      <!-- Hero -->
      <section class="py-16 md:py-24 relative overflow-hidden">
        <div class="absolute inset-0 hero-gradient opacity-[0.03]"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span class="material-symbols-outlined text-primary text-5xl mb-4" style="font-variation-settings: 'FILL' 1;">help</span>
          <h1 class="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">Questions fréquentes</h1>
          <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">Retrouvez les réponses aux questions les plus courantes sur la plateforme SureVote.</p>
        </div>
      </section>

      <!-- FAQ Content -->
      <section class="pb-20">
        <div class="max-w-3xl mx-auto px-6 space-y-4">
          @for (faq of faqs; track faq.q) {
            <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
              <button (click)="toggle(faq)" class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface-container-low/50 transition-colors">
                <span class="font-bold text-on-surface pr-4">{{ faq.q }}</span>
                <span class="material-symbols-outlined text-primary text-xl shrink-0 transition-transform duration-200" [class.rotate-180]="faq.open">expand_more</span>
              </button>
              @if (faq.open) {
                <div class="px-6 pb-5 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-4">
                  {{ faq.a }}
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- CTA -->
      <section class="py-16 bg-surface-container-low">
        <div class="max-w-3xl mx-auto px-6 text-center">
          <h2 class="text-2xl font-bold text-on-surface mb-3">Vous n'avez pas trouvé votre réponse ?</h2>
          <p class="text-on-surface-variant mb-8">Notre équipe est disponible pour vous aider.</p>
          <a routerLink="/contact" class="px-8 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all inline-flex items-center gap-2">
            Nous contacter <span class="material-symbols-outlined text-lg">mail</span>
          </a>
        </div>
      </section>

      <app-footer />
    </main>
  `
})
export class FaqComponent {
  constructor(private themeService: ThemeService) {}

  get isDark() { return this.themeService.isDark; }
  toggleDark(): void { this.themeService.toggle(); }

  faqs: { q: string; a: string; open: boolean }[] = [
    {
      q: 'Qu\'est-ce que SureVote ?',
      a: 'SureVote est une plateforme de vote électronique sécurisée qui permet aux organisations de mener des élections en ligne de manière transparente, anonyme et vérifiable. La plateforme utilise un chiffrement AES-256 pour garantir la confidentialité de chaque vote.',
      open: true
    },
    {
      q: 'Comment puis-je m\'inscrire ?',
      a: 'Cliquez sur le bouton "S\'inscrire" en haut de la page, remplissez le formulaire avec votre CIN, nom, prénom, email et mot de passe. Vous pouvez également activer l\'authentification à deux facteurs (2FA) pour une sécurité renforcée.',
      open: false
    },
    {
      q: 'Comment fonctionne l\'isoloir numérique ?',
      a: 'L\'isoloir numérique est un espace sécurisé où vous pouvez voter. Une fois que vous accédez à l\'élection, vous voyez la liste des candidats, sélectionnez votre choix, confirmez votre vote et recevez un reçu cryptographique. La session est limitée à 15 minutes et votre vote est chiffré de bout en bout.',
      open: false
    },
    {
      q: 'Qu\'est-ce qu\'un reçu cryptographique ?',
      a: 'Un reçu cryptographique est un identifiant unique généré après votre vote. Il vous permet de vérifier que votre vote a été correctement enregistré dans le système sans révéler pour qui vous avez voté. Vous pouvez le vérifier à tout moment depuis la page d\'accueil.',
      open: false
    },
    {
      q: 'Mon vote est-il vraiment anonyme ?',
      a: 'Oui, absolument. SureVote utilise un chiffrement de bout en bout AES-256. Votre vote est chiffré avant d\'être transmis et stocké. Même les administrateurs du système ne peuvent pas associer un vote à un électeur spécifique.',
      open: false
    },
    {
      q: 'Quels sont les différents rôles sur la plateforme ?',
      a: 'SureVote comprend quatre rôles : Administrateur (gestion des élections et utilisateurs), Électeur (voter et vérifier ses reçus), Observateur (surveiller le processus et consulter les audits), et Visiteur public (consulter les résultats publiés).',
      open: false
    },
    {
      q: 'Comment fonctionne la double authentification (2FA) ?',
      a: 'Si vous activez la 2FA lors de l\'inscription, un code à 6 chiffres sera envoyé à votre adresse email à chaque connexion. Vous devrez saisir ce code pour accéder à votre compte, ajoutant une couche de sécurité supplémentaire.',
      open: false
    },
    {
      q: 'Puis-je voter depuis mon téléphone ?',
      a: 'Oui, SureVote est entièrement responsive et fonctionne sur tous les appareils : ordinateur, tablette et smartphone. L\'interface s\'adapte automatiquement à la taille de votre écran.',
      open: false
    },
    {
      q: 'Les résultats des élections sont-ils publics ?',
      a: 'Les résultats sont publiés par l\'administrateur une fois l\'élection clôturée. Les résultats publiés incluent le nombre total de votes, le taux de participation et le classement des candidats, mais jamais les votes individuels.',
      open: false
    },
    {
      q: 'Comment les observateurs surveillent-ils les élections ?',
      a: 'Les observateurs accrédités ont accès à un tableau de bord dédié avec des métriques en temps réel (taux de participation, activité de vote) et un journal d\'audit complet qui enregistre toutes les actions du système de manière transparente et immuable.',
      open: false
    }
  ];

  toggle(faq: { open: boolean }): void {
    faq.open = !faq.open;
  }
}
