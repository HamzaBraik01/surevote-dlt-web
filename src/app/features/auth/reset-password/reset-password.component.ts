import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FooterComponent],
  template: `
    <main class="flex-grow flex items-center justify-center px-6 py-12 min-h-screen bg-surface">
      <div class="w-full max-w-[440px]">
        <div class="text-center mb-8">
          <span class="text-3xl font-black tracking-tighter text-primary">SUREVOTE</span>
        </div>
        <div class="bg-surface-container-lowest p-8 md:p-10 rounded-xl whisper-shadow border border-outline-variant/10">
          <h2 class="text-xl font-bold text-on-surface mb-1">Nouveau mot de passe</h2>
          <p class="text-sm text-on-surface-variant mb-6">Choisissez un mot de passe sécurisé.</p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nouveau mot de passe</label>
              <input formControlName="newPassword" type="password" placeholder="••••••••"
                class="block w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary transition-all outline-none" />
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Confirmer</label>
              <input formControlName="confirmPassword" type="password" placeholder="••••••••"
                class="block w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary transition-all outline-none" />
            </div>
            <button type="submit" [disabled]="loading"
              class="w-full hero-gradient text-on-primary font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
              Réinitialiser le mot de passe
            </button>
          </form>
          <p class="text-center mt-6 text-sm">
            <a routerLink="/auth/login" class="text-primary font-bold hover:underline">← Retour à la connexion</a>
          </p>
        </div>
      </div>
    </main>
    <app-footer />
  `
})
export class ResetPasswordComponent {
  form: FormGroup;
  loading = false;
  private token = '';

  constructor(
    private fb: FormBuilder, private authService: AuthService,
    private toastService: ToastService, private route: ActivatedRoute, private router: Router
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
    this.route.queryParams.subscribe(p => this.token = p['token'] || '');
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { newPassword, confirmPassword } = this.form.value;
    if (newPassword !== confirmPassword) {
      this.toastService.error('Les mots de passe ne correspondent pas');
      return;
    }
    this.loading = true;
    this.authService.confirmPasswordReset({ token: this.token, newPassword, confirmPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Mot de passe réinitialisé avec succès');
        this.router.navigate(['/auth/login']);
      },
      error: () => { this.loading = false; this.toastService.error('Lien expiré ou invalide'); }
    });
  }
}
