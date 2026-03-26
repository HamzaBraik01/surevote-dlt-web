import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
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
          <a routerLink="/faq" class="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">FAQ</a>
          <a routerLink="/contact" class="text-sm font-semibold text-primary">Contact</a>
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
          <span class="material-symbols-outlined text-primary text-5xl mb-4" style="font-variation-settings: 'FILL' 1;">mail</span>
          <h1 class="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">Contactez-nous</h1>
          <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">Une question, un problème ou une suggestion ? Notre équipe est à votre écoute.</p>
        </div>
      </section>

      <!-- Contact Content -->
      <section class="pb-20">
        <div class="max-w-6xl mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <!-- Contact Form -->
            <div class="lg:col-span-3">
              <div class="bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-outline-variant/10">
                <h2 class="text-xl font-bold text-on-surface mb-6">Envoyez-nous un message</h2>
                <form (ngSubmit)="onSubmit()" class="space-y-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="space-y-1">
                      <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nom complet</label>
                      <input [(ngModel)]="form.name" name="name" placeholder="Votre nom"
                        class="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
                    </div>
                    <div class="space-y-1">
                      <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
                      <input [(ngModel)]="form.email" name="email" type="email" placeholder="votre@email.com"
                        class="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Sujet</label>
                    <select [(ngModel)]="form.subject" name="subject"
                      class="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface focus:ring-2 focus:ring-primary transition-all outline-none">
                      <option value="">Sélectionnez un sujet</option>
                      <option value="support">Support technique</option>
                      <option value="security">Problème de sécurité</option>
                      <option value="feature">Demande de fonctionnalité</option>
                      <option value="partnership">Partenariat</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Message</label>
                    <textarea [(ngModel)]="form.message" name="message" rows="5" placeholder="Décrivez votre demande en détail..."
                      class="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none resize-none"></textarea>
                  </div>
                  <button type="submit" [disabled]="sending"
                    class="w-full py-4 hero-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    @if (sending) {
                      <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    } @else {
                      <span>Envoyer</span>
                      <span class="material-symbols-outlined text-lg">send</span>
                    }
                  </button>
                </form>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
                <h3 class="text-lg font-bold text-on-surface mb-6">Informations de contact</h3>
                <div class="space-y-5">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-primary text-lg" style="font-variation-settings: 'FILL' 1;">mail</span>
                    </div>
                    <div>
                      <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Email</p>
                      <p class="text-sm font-medium text-on-surface">support&#64;surevote.com</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-emerald-600 text-lg" style="font-variation-settings: 'FILL' 1;">call</span>
                    </div>
                    <div>
                      <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Téléphone</p>
                      <p class="text-sm font-medium text-on-surface">+212 5XX-XXXXXX</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-amber-600 text-lg" style="font-variation-settings: 'FILL' 1;">location_on</span>
                    </div>
                    <div>
                      <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Adresse</p>
                      <p class="text-sm font-medium text-on-surface">YouCode - UM6P<br/>Ben Guerir, Maroc</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-blue-600 text-lg" style="font-variation-settings: 'FILL' 1;">schedule</span>
                    </div>
                    <div>
                      <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Horaires</p>
                      <p class="text-sm font-medium text-on-surface">Lun - Ven : 9h - 18h</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Links -->
              <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
                <h3 class="text-lg font-bold text-on-surface mb-4">Liens rapides</h3>
                <div class="space-y-3">
                  <a routerLink="/faq" class="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors group">
                    <span class="material-symbols-outlined text-lg group-hover:text-primary transition-colors">help</span>
                    Consulter la FAQ
                  </a>
                  <a routerLink="/elections" class="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors group">
                    <span class="material-symbols-outlined text-lg group-hover:text-primary transition-colors">ballot</span>
                    Voir les élections
                  </a>
                  <a routerLink="/auth/register" class="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors group">
                    <span class="material-symbols-outlined text-lg group-hover:text-primary transition-colors">person_add</span>
                    Créer un compte
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <app-footer />
    </main>
  `
})
export class ContactComponent {
  form = { name: '', email: '', subject: '', message: '' };
  sending = false;

  constructor(private themeService: ThemeService, private toastService: ToastService) {}

  get isDark() { return this.themeService.isDark; }
  toggleDark(): void { this.themeService.toggle(); }

  onSubmit(): void {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.toastService.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }
    this.sending = true;
    // Simulate sending
    setTimeout(() => {
      this.sending = false;
      this.toastService.success('Message envoyé avec succès ! Nous vous répondrons sous 48h.');
      this.form = { name: '', email: '', subject: '', message: '' };
    }, 1500);
  }
}
