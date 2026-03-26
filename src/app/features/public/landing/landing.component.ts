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
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent, FooterComponent],
  template: `
    <!-- Public Navbar -->
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">shield_lock</span>
          <span class="text-xl font-black tracking-tighter text-primary">SUREVOTE</span>
        </a>
        <!-- Mobile hamburger -->
        <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="md:hidden p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined text-on-surface">{{ mobileMenuOpen() ? 'close' : 'menu' }}</span>
        </button>
        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center space-x-6">
          <a routerLink="/elections" class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Élections</a>
          <a routerLink="/faq" class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">FAQ</a>
          <a routerLink="/contact" class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Contact</a>
          <button (click)="toggleDark()" class="p-2 rounded-xl hover:bg-surface-container-high transition-colors" title="Changer le thème">
            <span class="material-symbols-outlined text-on-surface-variant text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <a routerLink="/auth/login" class="text-sm font-semibold text-primary hover:underline">Connexion</a>
          <a routerLink="/auth/register" class="px-5 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
            S'inscrire
          </a>
        </nav>
      </div>
      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden bg-surface-container-lowest border-t border-outline-variant/10 px-6 py-4 space-y-3">
          <a routerLink="/elections" (click)="mobileMenuOpen.set(false)" class="block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2">Élections</a>
          <a routerLink="/faq" (click)="mobileMenuOpen.set(false)" class="block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2">FAQ</a>
          <a routerLink="/contact" (click)="mobileMenuOpen.set(false)" class="block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2">Contact</a>
          <button (click)="toggleDark()" class="w-full text-left text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
            {{ isDark() ? 'Mode clair' : 'Mode sombre' }}
          </button>
          <a routerLink="/auth/login" (click)="mobileMenuOpen.set(false)" class="block text-sm font-semibold text-primary hover:underline py-2">Connexion</a>
          <a routerLink="/auth/register" (click)="mobileMenuOpen.set(false)" class="block text-center px-5 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg">S'inscrire</a>
        </div>
      }
    </header>

    <main class="pt-20 bg-surface">
      <!-- ============================================================ -->
      <!-- HERO SECTION -->
      <!-- ============================================================ -->
      <section class="relative py-28 md:py-40 overflow-hidden">
        <div class="absolute inset-0 hero-gradient opacity-[0.03]"></div>
        <div class="absolute -top-40 -right-40 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-60 -left-40 w-[500px] h-[500px] bg-primary-container/5 rounded-full blur-3xl"></div>
        <div class="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div class="inline-flex items-center gap-2 bg-primary-fixed/30 text-primary px-4 py-2 rounded-full mb-8">
            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-widest">Plateforme de Vote Souverain</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-6 leading-[0.95]">
            Votez en toute<br/><span class="text-primary">confiance.</span>
          </h1>
          <p class="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
            Une infrastructure de vote électronique de pointe, conçue pour garantir la transparence, la sécurité et l'intégrité de chaque scrutin.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/auth/register" class="px-10 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-lg">
              Commencer gratuitement <span class="material-symbols-outlined text-xl">arrow_forward</span>
            </a>
            <a routerLink="/elections" class="px-10 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-all flex items-center gap-2 text-lg">
              Explorer <span class="material-symbols-outlined text-xl">ballot</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- STATS BAR -->
      <!-- ============================================================ -->
      <section class="py-12 bg-surface-container-low border-y border-outline-variant/10">
        <div class="max-w-6xl mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p class="text-3xl md:text-4xl font-black text-primary mb-1">10K+</p>
              <p class="text-sm text-on-surface-variant font-medium">Votes sécurisés</p>
            </div>
            <div>
              <p class="text-3xl md:text-4xl font-black text-primary mb-1">99.9%</p>
              <p class="text-sm text-on-surface-variant font-medium">Disponibilité</p>
            </div>
            <div>
              <p class="text-3xl md:text-4xl font-black text-primary mb-1">AES-256</p>
              <p class="text-sm text-on-surface-variant font-medium">Chiffrement</p>
            </div>
            <div>
              <p class="text-3xl md:text-4xl font-black text-primary mb-1">2FA</p>
              <p class="text-sm text-on-surface-variant font-medium">Authentification</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- FEATURES SECTION -->
      <!-- ============================================================ -->
      <section class="py-20 md:py-28">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Fonctionnalités</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Tout ce dont vous avez besoin</h2>
            <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">
              Une suite complète d'outils pour organiser, sécuriser et auditer vos scrutins électroniques.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-primary-fixed/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">encrypted</span>
              </div>
              <h3 class="text-lg font-bold text-on-surface mb-2">Chiffrement de bout en bout</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Chaque vote est chiffré avec AES-256 avant d'être transmis, garantissant l'anonymat total de l'électeur.</p>
            </div>

            <!-- Feature 2 -->
            <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-emerald-600 text-2xl" style="font-variation-settings: 'FILL' 1;">verified_user</span>
              </div>
              <h3 class="text-lg font-bold text-on-surface mb-2">Reçu cryptographique</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Chaque électeur reçoit un reçu vérifiable, permettant de confirmer l'enregistrement de son vote sans compromettre le secret.</p>
            </div>

            <!-- Feature 3 -->
            <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-amber-600 text-2xl" style="font-variation-settings: 'FILL' 1;">security</span>
              </div>
              <h3 class="text-lg font-bold text-on-surface mb-2">Authentification renforcée</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Double authentification (2FA), vérification CIN, et contrôle d'identité rigoureux avant chaque scrutin.</p>
            </div>

            <!-- Feature 4 -->
            <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-blue-600 text-2xl" style="font-variation-settings: 'FILL' 1;">monitoring</span>
              </div>
              <h3 class="text-lg font-bold text-on-surface mb-2">Audit en temps réel</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Les observateurs accrédités surveillent le processus en temps réel via un journal d'audit transparent et immuable.</p>
            </div>

            <!-- Feature 5 -->
            <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-purple-600 text-2xl" style="font-variation-settings: 'FILL' 1;">admin_panel_settings</span>
              </div>
              <h3 class="text-lg font-bold text-on-surface mb-2">Gestion avancée</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Tableau de bord complet pour gérer les élections, candidats, collèges électoraux et utilisateurs.</p>
            </div>

            <!-- Feature 6 -->
            <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <div class="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-rose-600 text-2xl" style="font-variation-settings: 'FILL' 1;">devices</span>
              </div>
              <h3 class="text-lg font-bold text-on-surface mb-2">Multi-plateforme</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Interface responsive et accessible depuis ordinateur, tablette et mobile. Votez où que vous soyez.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- HOW IT WORKS -->
      <!-- ============================================================ -->
      <section class="py-20 md:py-28 bg-surface-container-low">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Comment ça marche</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Simple, rapide, sécurisé</h2>
            <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">En quatre étapes, participez à un scrutin en toute sérénité.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Step 1 -->
            <div class="text-center relative">
              <div class="w-16 h-16 rounded-2xl hero-gradient text-white flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg shadow-primary/20">1</div>
              <h3 class="font-bold text-on-surface mb-2">Inscrivez-vous</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Créez votre compte avec votre CIN et activez la double authentification.</p>
              <div class="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>

            <!-- Step 2 -->
            <div class="text-center relative">
              <div class="w-16 h-16 rounded-2xl hero-gradient text-white flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg shadow-primary/20">2</div>
              <h3 class="font-bold text-on-surface mb-2">Vérification</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Votre identité est vérifiée et vous êtes assigné à votre collège électoral.</p>
              <div class="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>

            <!-- Step 3 -->
            <div class="text-center relative">
              <div class="w-16 h-16 rounded-2xl hero-gradient text-white flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg shadow-primary/20">3</div>
              <h3 class="font-bold text-on-surface mb-2">Votez</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Accédez à l'isoloir numérique et soumettez votre vote de manière anonyme.</p>
              <div class="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent"></div>
            </div>

            <!-- Step 4 -->
            <div class="text-center">
              <div class="w-16 h-16 rounded-2xl hero-gradient text-white flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg shadow-primary/20">4</div>
              <h3 class="font-bold text-on-surface mb-2">Reçu sécurisé</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">Recevez un reçu cryptographique pour vérifier que votre vote a été enregistré.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- ROLES SECTION -->
      <!-- ============================================================ -->
      <section class="py-20 md:py-28">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Pour chaque acteur</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Un portail adapté à votre rôle</h2>
            <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">Chaque utilisateur dispose d'une interface conçue pour ses besoins spécifiques.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Admin -->
            <div class="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div class="h-2 hero-gradient"></div>
              <div class="p-8">
                <div class="w-14 h-14 rounded-2xl bg-primary-fixed/30 flex items-center justify-center mb-6">
                  <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">admin_panel_settings</span>
                </div>
                <h3 class="text-xl font-bold text-on-surface mb-3">Administrateur</h3>
                <ul class="space-y-2">
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> Créer et gérer les élections</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> Enregistrer les candidats</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> Gérer les collèges électoraux</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> Superviser les utilisateurs</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> Consulter les statistiques</li>
                </ul>
              </div>
            </div>

            <!-- Voter -->
            <div class="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 md:scale-105 md:shadow-lg md:shadow-primary/10 md:z-10">
              <div class="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <div class="p-8">
                <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <span class="material-symbols-outlined text-emerald-600 text-2xl" style="font-variation-settings: 'FILL' 1;">how_to_vote</span>
                </div>
                <h3 class="text-xl font-bold text-on-surface mb-3">Électeur</h3>
                <ul class="space-y-2">
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span> Consulter les élections ouvertes</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span> Voter dans l'isoloir numérique</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span> Recevoir un reçu cryptographique</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span> Vérifier l'intégrité du vote</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-emerald-600 text-sm">check_circle</span> Gérer son profil</li>
                </ul>
              </div>
            </div>

            <!-- Observer -->
            <div class="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
              <div class="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div class="p-8">
                <div class="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                  <span class="material-symbols-outlined text-amber-600 text-2xl" style="font-variation-settings: 'FILL' 1;">visibility</span>
                </div>
                <h3 class="text-xl font-bold text-on-surface mb-3">Observateur</h3>
                <ul class="space-y-2">
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-amber-600 text-sm">check_circle</span> Surveiller le processus en direct</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-amber-600 text-sm">check_circle</span> Consulter le journal d'audit</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-amber-600 text-sm">check_circle</span> Analyser les métriques</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-amber-600 text-sm">check_circle</span> Vérifier la participation</li>
                  <li class="flex items-center gap-2 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-amber-600 text-sm">check_circle</span> Exporter les rapports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- VERIFY RECEIPT -->
      <!-- ============================================================ -->
      <section class="py-20 bg-surface-container-low">
        <div class="max-w-3xl mx-auto px-6 text-center">
          <span class="material-symbols-outlined text-primary text-4xl mb-4" style="font-variation-settings: 'FILL' 1;">fact_check</span>
          <h2 class="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Vérifiez votre reçu de vote</h2>
          <p class="text-on-surface-variant mb-8">Entrez votre identifiant cryptographique pour confirmer l'enregistrement de votre vote.</p>
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
            <div class="mt-6 p-4 rounded-xl" [class]="receiptResult ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'bg-red-500/10 text-red-800 dark:text-red-300'">
              <div class="flex items-center justify-center gap-2">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{{ receiptResult ? 'check_circle' : 'cancel' }}</span>
                <span class="font-semibold text-sm">{{ receiptResult ? 'Vote vérifié avec succès !' : 'Reçu non trouvé.' }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- PUBLISHED ELECTIONS -->
      <!-- ============================================================ -->
      <section class="py-20">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-12">
            <span class="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Résultats</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Résultats publiés</h2>
            <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">Consultez les résultats des scrutins terminés en toute transparence.</p>
          </div>

          @if (publishedElections.length === 0) {
            <div class="text-center py-16 text-on-surface-variant">
              <span class="material-symbols-outlined text-5xl mb-4">ballot</span>
              <p class="font-medium">Aucun résultat publié pour le moment.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (e of publishedElections; track e.id) {
                <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300">
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

      <!-- ============================================================ -->
      <!-- CTA SECTION -->
      <!-- ============================================================ -->
      <section class="py-20 md:py-28 relative overflow-hidden">
        <div class="absolute inset-0 hero-gradient opacity-[0.06]"></div>
        <div class="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 class="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
            Prêt à transformer vos<br/><span class="text-primary">scrutins ?</span>
          </h2>
          <p class="text-lg text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed">
            Rejoignez les institutions qui font confiance à SureVote pour des élections transparentes et sécurisées.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/auth/register" class="px-10 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-lg">
              Créer un compte <span class="material-symbols-outlined text-xl">rocket_launch</span>
            </a>
            <a routerLink="/contact" class="px-10 py-4 bg-surface-container-lowest text-on-surface font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-container-low transition-all flex items-center gap-2 text-lg">
              Nous contacter <span class="material-symbols-outlined text-xl">mail</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <app-footer />
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
