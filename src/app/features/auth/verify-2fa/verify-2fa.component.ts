import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-verify-2fa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span class="text-2xl font-bold tracking-tighter text-primary">SUREVOTE</span>
        <div class="flex items-center gap-2 text-on-surface-variant text-sm font-medium bg-surface-container-low px-3 py-1.5 rounded-full">
          <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">lock</span>
          Session Sécurisée
        </div>
      </div>
    </header>

    <main class="flex-grow flex items-center justify-center px-4 pt-20 pb-12 min-h-screen bg-surface">
      <div class="w-full max-w-lg">
        <div class="bg-surface-container-lowest rounded-xl p-8 md:p-12 whisper-shadow relative overflow-hidden">
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed mb-6 text-primary">
              <span class="material-symbols-outlined text-4xl">shield_person</span>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-on-surface mb-3">Double Authentification</h1>
            <p class="text-on-surface-variant text-sm leading-relaxed max-w-sm mx-auto">
              Pour garantir l'intégrité de votre vote, veuillez saisir le code de vérification à 6 chiffres envoyé à votre adresse email enregistrée.
            </p>
          </div>

          <form (ngSubmit)="onSubmit()" class="space-y-8">
            <div class="flex justify-between gap-2 md:gap-4">
              @for (i of [0,1,2,3,4,5]; track i) {
                <input #otpInput
                  [(ngModel)]="digits[i]" [name]="'digit'+i"
                  (input)="onDigitInput(i, $event)"
                  (keydown)="onKeyDown(i, $event)"
                  [attr.aria-label]="'Digit ' + (i+1)"
                  maxlength="1" type="text"
                  class="otp-input w-12 h-16 md:w-16 md:h-20 text-center text-2xl font-bold border-none bg-surface-container-low text-primary rounded-xl focus:ring-2 focus:ring-primary transition-all" />
              }
            </div>

            <div class="space-y-4">
              <button type="submit" [disabled]="loading"
                class="w-full py-4 px-8 bg-gradient-to-br from-primary to-primary-container text-white font-semibold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                @if (loading) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                } @else {
                  <span>Confirmer</span>
                  <span class="material-symbols-outlined text-lg">verified</span>
                }
              </button>
              <button type="button" (click)="onResend()" [disabled]="resending"
                class="w-full py-3 px-8 bg-surface-container-high text-on-secondary-container font-medium rounded-xl hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                <span>Renvoyer le code</span>
                <span class="material-symbols-outlined text-lg">refresh</span>
              </button>
            </div>
          </form>

          <div class="mt-10 pt-8 border-t border-outline-variant/20 flex flex-col items-center gap-4">
            <div class="flex items-center gap-3 text-xs font-semibold text-emerald-700 bg-emerald-500/10 px-4 py-2 rounded-full">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PROTECTION CRYPTOGRAPHIQUE ACTIVÉE
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="fixed -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    <div class="fixed -top-24 -right-24 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl -z-10"></div>
  `
})
export class Verify2FAComponent {
  digits: string[] = ['', '', '', '', '', ''];
  loading = false;
  resending = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      const next = input.parentElement?.querySelectorAll('input')[index + 1];
      (next as HTMLInputElement)?.focus();
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      const prev = (event.target as HTMLElement).parentElement?.querySelectorAll('input')[index - 1];
      (prev as HTMLInputElement)?.focus();
    }
  }

  onSubmit(): void {
    const code = this.digits.join('');
    if (code.length !== 6) {
      this.toastService.warning('Veuillez saisir les 6 chiffres');
      return;
    }
    this.loading = true;
    this.authService.verify2FA({ otpCode: code }).subscribe({
      next: () => {
        this.loading = false;
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            this.toastService.success('Vérification réussie !');
            this.router.navigate([user.role === 'ADMIN' ? '/admin/dashboard' : '/voter/dashboard']);
          },
          error: () => this.router.navigate(['/voter/dashboard'])
        });
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Code invalide');
      }
    });
  }

  onResend(): void {
    this.resending = true;
    this.authService.resend2FA().subscribe({
      next: () => {
        this.resending = false;
        this.toastService.success('Code renvoyé avec succès');
      },
      error: () => {
        this.resending = false;
        this.toastService.error('Erreur lors du renvoi');
      }
    });
  }
}
