import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center">
      <div class="relative mb-8">
        <span class="text-[160px] font-black text-primary/10 leading-none select-none">404</span>
        <span class="material-symbols-outlined text-7xl text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style="font-variation-settings: 'FILL' 1;">
          explore_off
        </span>
      </div>
      <h1 class="text-3xl font-extrabold text-on-surface tracking-tight mb-3">Page introuvable</h1>
      <p class="text-on-surface-variant text-lg max-w-md mb-10 leading-relaxed">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <a routerLink="/"
          class="px-8 py-3.5 hero-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">home</span> Retour à l'accueil
        </a>
        <a routerLink="/auth/login"
          class="px-8 py-3.5 bg-surface-container-high text-on-secondary-container font-bold rounded-xl hover:bg-surface-variant transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">login</span> Se connecter
        </a>
      </div>
      <p class="mt-16 text-sm text-on-surface-variant">
        <span class="font-bold text-primary">SUREVOTE</span> · Système de Vote Électronique Sécurisé
      </p>
    </div>
  `
})
export class NotFoundComponent {}
