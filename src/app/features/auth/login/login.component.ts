import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden min-h-screen bg-surface">
      <!-- Background blurs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div class="w-full max-w-[440px] z-10">
        <!-- Brand -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center p-3 mb-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
            <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">shield_lock</span>
          </div>
          <h1 class="text-3xl font-black tracking-tighter text-primary mb-2">SUREVOTE</h1>
          <p class="text-on-surface-variant font-medium text-sm tracking-tight">Système de Vote Électronique Sécurisé</p>
        </div>

        <!-- Card -->
        <div class="bg-surface-container-lowest p-8 md:p-10 rounded-xl whisper-shadow border border-outline-variant/10">
          <div class="mb-8">
            <h2 class="text-xl font-bold text-on-surface tracking-tight mb-1">Connexion</h2>
            <p class="text-sm text-on-surface-variant">Veuillez entrer vos identifiants pour accéder au portail.</p>
          </div>

          @if (serverError) {
            <div class="mb-6 p-4 bg-error-container rounded-xl flex items-start gap-3">
              <span class="material-symbols-outlined text-error text-sm mt-0.5">error</span>
              <p class="text-sm text-on-error-container font-medium">{{ serverError }}</p>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant" for="email">Email</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">mail</span>
                </div>
                <input formControlName="email" id="email" type="email" placeholder="nom&#64;institution.fr"
                  class="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none" />
              </div>
              @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']) {
                <p class="text-xs text-error font-medium">L'email est requis</p>
              }
              @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']) {
                <p class="text-xs text-error font-medium">Format d'email invalide</p>
              }
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant" for="password">Mot de passe</label>
                <a routerLink="/auth/forgot-password" class="text-xs font-semibold text-primary hover:underline transition-all">Mot de passe oublié ?</a>
              </div>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input formControlName="password" id="password" [type]="showPassword ? 'text' : 'password'" placeholder="••••••••"
                  class="block w-full pl-11 pr-12 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none" />
                <button type="button" (click)="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface-variant">
                  <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
                <p class="text-xs text-error font-medium">Le mot de passe est requis</p>
              }
            </div>

            <!-- Remember Me -->
            <div class="flex items-center space-x-3 py-1">
              <input formControlName="remember" id="remember" type="checkbox"
                class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-low" />
              <label for="remember" class="text-sm text-on-surface-variant font-medium select-none">Rester connecté sur cet appareil</label>
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="loading"
              class="w-full hero-gradient text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60">
              @if (loading) {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              } @else {
                <span>Se connecter</span>
                <span class="material-symbols-outlined text-lg">arrow_forward</span>
              }
            </button>
          </form>

          <!-- Trust Footer -->
          <div class="mt-10 pt-8 border-t border-outline-variant/10 flex flex-col items-center space-y-4">
            <div class="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 rounded-full">
              <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Connexion Sécurisée AES-256</span>
            </div>
            <p class="text-[11px] text-center text-on-surface-variant/60 leading-relaxed px-4">
              En vous connectant, vous acceptez les conditions d'utilisation et la politique de confidentialité de la plateforme SUREVOTE.
            </p>
          </div>
        </div>

        <!-- Register Link -->
        <p class="text-center mt-8 text-sm text-on-surface-variant">
          Pas encore de compte ?
          <a routerLink="/auth/register" class="text-primary font-bold hover:underline">S'enregistrer</a>
        </p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 px-6 text-center bg-surface">
      <div class="flex justify-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
        <a class="hover:text-primary transition-colors" href="#">Support</a>
        <a routerLink="/observer/audit" class="hover:text-primary transition-colors">Audit Public</a>
        <a class="hover:text-primary transition-colors" href="#">Contact</a>
      </div>
    </footer>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    // Clear any stale session data when arriving at the login page
    this.authService.clearSession();

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.serverError = '';
    const { email, password, remember } = this.loginForm.value;

    // Safety timeout: if the observable never completes (e.g., interceptor pipeline stuck), reset after 10s
    const loginTimeout = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.serverError = 'Délai de connexion dépassé. Veuillez réessayer.';
      }
    }, 10000);

    this.authService.login({ email, motDePasse: password }).pipe(
      finalize(() => {
        clearTimeout(loginTimeout);
        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.markForCheck();
        });
      })
    ).subscribe({
      next: (res) => {
        if (res.requiresTwoFactor) {
          this.router.navigate(['/auth/verify-2fa']);
        } else {
          const role = this.authService.userRole;
          if (role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
          else if (role === 'OBSERVATEUR') this.router.navigate(['/observer/dashboard']);
          else this.router.navigate(['/voter/dashboard']);
        }
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.serverError = err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
          this.loading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }
}
