import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden min-h-screen bg-surface">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <div class="w-full max-w-[520px] z-10">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center p-3 mb-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
            <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">shield_lock</span>
          </div>
          <h1 class="text-3xl font-black tracking-tighter text-primary mb-2">SUREVOTE</h1>
        </div>

        <div class="bg-surface-container-lowest p-8 md:p-10 rounded-xl whisper-shadow border border-outline-variant/10">
          <div class="mb-6">
            <h2 class="text-xl font-bold text-on-surface tracking-tight mb-1">Créer un compte</h2>
            <p class="text-sm text-on-surface-variant">Remplissez le formulaire pour vous inscrire.</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nom</label>
                <input formControlName="nom" placeholder="Dupont"
                  class="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
                @if (registerForm.get('nom')?.touched && registerForm.get('nom')?.errors?.['required']) {
                  <p class="text-xs text-error font-medium">Le nom est requis</p>
                }
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Prénom</label>
                <input formControlName="prenom" placeholder="Jean"
                  class="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
                @if (registerForm.get('prenom')?.touched && registerForm.get('prenom')?.errors?.['required']) {
                  <p class="text-xs text-error font-medium">Le prénom est requis</p>
                }
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">CIN</label>
              <input formControlName="cin" placeholder="AB123456"
                class="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
              @if (registerForm.get('cin')?.touched && registerForm.get('cin')?.errors?.['required']) {
                <p class="text-xs text-error font-medium">Le CIN est requis</p>
              }
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
              <input formControlName="email" type="email" placeholder="nom&#64;institution.fr"
                class="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']) {
                <p class="text-xs text-error font-medium">L'email est requis</p>
              } @else if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']) {
                <p class="text-xs text-error font-medium">Format d'email invalide</p>
              }
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Téléphone</label>
              <input formControlName="telephone" placeholder="+212600000000"
                class="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Mot de passe</label>
                <input formControlName="motDePasse" type="password" placeholder="••••••••"
                  class="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
                @if (registerForm.get('motDePasse')?.touched && registerForm.get('motDePasse')?.errors?.['required']) {
                  <p class="text-xs text-error font-medium">Le mot de passe est requis</p>
                } @else if (registerForm.get('motDePasse')?.touched && registerForm.get('motDePasse')?.errors?.['minlength']) {
                  <p class="text-xs text-error font-medium">Minimum 8 caractères</p>
                }
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Confirmer</label>
                <input formControlName="confirmationMotDePasse" type="password" placeholder="••••••••"
                  class="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all outline-none" />
                @if (registerForm.get('confirmationMotDePasse')?.touched && registerForm.get('confirmationMotDePasse')?.errors?.['required']) {
                  <p class="text-xs text-error font-medium">La confirmation est requise</p>
                }
              </div>
            </div>

            <div class="flex items-center space-x-3 py-1">
              <input formControlName="doubleFacteurActif" type="checkbox" id="2fa"
                class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-low" />
              <label for="2fa" class="text-sm text-on-surface-variant font-medium select-none">Activer la double authentification (2FA)</label>
            </div>

            <button type="submit" [disabled]="loading"
              class="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2">
              @if (loading) {
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              } @else {
                <span>S'inscrire</span>
                <span class="material-symbols-outlined text-lg">person_add</span>
              }
            </button>
          </form>
        </div>
        <p class="text-center mt-6 text-sm text-on-surface-variant">
          Déjà un compte ? <a routerLink="/auth/login" class="text-primary font-bold hover:underline">Se connecter</a>
        </p>
      </div>
    </main>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      cin: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
      confirmationMotDePasse: ['', Validators.required],
      telephone: [''],
      doubleFacteurActif: [false]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { motDePasse, confirmationMotDePasse } = this.registerForm.value;
    if (motDePasse !== confirmationMotDePasse) {
      this.toastService.error('Les mots de passe ne correspondent pas');
      return;
    }
    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.success('Inscription réussie ! Vous pouvez vous connecter.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error(err.error?.message || 'Erreur lors de l\'inscription');
      }
    });
  }
}
