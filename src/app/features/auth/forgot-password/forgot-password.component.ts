import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FooterComponent],
  template: `
    <main class="flex-grow flex items-center justify-center px-6 py-12 min-h-screen bg-surface relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <div class="w-full max-w-[440px] z-10">
        <div class="text-center mb-8">
          <span class="text-3xl font-black tracking-tighter text-primary">SUREVOTE</span>
        </div>
        <div class="bg-surface-container-lowest p-8 md:p-10 rounded-xl whisper-shadow border border-outline-variant/10">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-fixed mb-4 text-primary">
              <span class="material-symbols-outlined text-3xl">lock_reset</span>
            </div>
            <h2 class="text-xl font-bold text-on-surface mb-1">Mot de passe oublié</h2>
            <p class="text-sm text-on-surface-variant">Entrez votre email pour recevoir un lien de réinitialisation.</p>
          </div>

          @if (!sent) {
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
                <input formControlName="email" type="email" placeholder="nom&#64;institution.fr"
                  class="block w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
              </div>
              <button type="submit" [disabled]="loading"
                class="w-full hero-gradient text-on-primary font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                @if (loading) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                } @else {
                  <span>Envoyer le lien</span>
                  <span class="material-symbols-outlined text-lg">send</span>
                }
              </button>
            </form>
          } @else {
            <div class="text-center py-6">
              <span class="material-symbols-outlined text-emerald-600 text-5xl mb-4" style="font-variation-settings: 'FILL' 1;">mark_email_read</span>
              <p class="text-on-surface font-semibold mb-2">Email envoyé !</p>
              <p class="text-sm text-on-surface-variant">Vérifiez votre boîte de réception pour le lien de réinitialisation.</p>
            </div>
          }
          <p class="text-center mt-6 text-sm text-on-surface-variant">
            <a routerLink="/auth/login" class="text-primary font-bold hover:underline">← Retour à la connexion</a>
          </p>
        </div>
      </div>
    </main>
    <app-footer />
  `
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  sent = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: ToastService) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.requestPasswordReset(this.form.value).subscribe({
      next: () => { this.loading = false; this.sent = true; },
      error: () => { this.loading = false; this.toastService.error('Erreur lors de l\'envoi'); }
    });
  }
}
