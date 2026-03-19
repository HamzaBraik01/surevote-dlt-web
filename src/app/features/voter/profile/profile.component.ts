import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { Utilisateur } from '../../../core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1 class="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Mon Profil</h1>
    <p class="text-on-surface-variant text-lg mb-10">Gérez vos informations personnelles et les paramètres de sécurité.</p>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Info -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-surface-container-lowest rounded-xl p-8">
          <h2 class="text-lg font-bold text-on-surface mb-6">Informations Personnelles</h2>
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nom</label>
                <input formControlName="nom" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
                @if (profileForm.get('nom')?.touched && profileForm.get('nom')?.errors?.['required']) {
                  <p class="text-xs text-error font-medium">Le nom est requis</p>
                }
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Prénom</label>
                <input formControlName="prenom" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
                @if (profileForm.get('prenom')?.touched && profileForm.get('prenom')?.errors?.['required']) {
                  <p class="text-xs text-error font-medium">Le prénom est requis</p>
                }
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label>
              <input formControlName="email" type="email" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Téléphone</label>
              <input formControlName="telephone" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">CIN</label>
                <input formControlName="cin" [disabled]="true" class="w-full px-4 py-3 bg-surface-container-high rounded-xl border-transparent text-on-surface-variant cursor-not-allowed" />
            </div>
            <div class="pt-2">
              <button type="submit" [disabled]="profileForm.invalid || profileForm.pristine"
                class="px-6 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>

        <!-- Password Change -->
        <div class="bg-surface-container-lowest rounded-xl p-8">
          <h2 class="text-lg font-bold text-on-surface mb-6">Modifier le mot de passe</h2>
          <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Mot de passe actuel</label>
              <input formControlName="currentPassword" type="password" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Nouveau mot de passe</label>
                <input formControlName="newPassword" type="password" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Confirmer</label>
                <input formControlName="confirmPassword" type="password" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <button type="submit" [disabled]="passwordForm.invalid"
              class="px-6 py-3 bg-surface-container-high text-on-secondary-container font-bold rounded-xl hover:bg-surface-variant transition-colors disabled:opacity-50">
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Security Card -->
        <div class="bg-surface-container-lowest rounded-xl p-6">
          <h3 class="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Sécurité</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">shield_person</span>
                <div>
                  <p class="text-sm font-bold text-on-surface">Double Authentification</p>
                  <p class="text-xs text-on-surface-variant">{{ user?.doubleFacteurActif ? 'Activée' : 'Désactivée' }}</p>
                </div>
              </div>
              <button (click)="toggle2FA()" class="px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                [class]="user?.doubleFacteurActif ? 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'">
                {{ user?.doubleFacteurActif ? 'Désactiver' : 'Activer' }}
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-on-surface-variant">badge</span>
                <div>
                  <p class="text-sm font-bold text-on-surface">Rôle</p>
                  <p class="text-xs text-on-surface-variant">{{ user?.role }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-on-surface-variant">calendar_today</span>
                <div>
                  <p class="text-sm font-bold text-on-surface">Inscription</p>
                  <p class="text-xs text-on-surface-variant">{{ user?.dateCreation | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Info -->
        <div class="bg-gradient-to-br from-inverse-surface to-slate-800 rounded-xl p-6 text-white">
          <span class="material-symbols-outlined text-2xl mb-3">security</span>
          <h3 class="font-bold mb-1">Session Active</h3>
          <p class="text-slate-300 text-xs leading-relaxed mb-4">Votre session est protégée par un chiffrement AES-256 de bout en bout.</p>
          <button (click)="logoutAll()" class="text-xs font-bold underline underline-offset-4 hover:text-white">
            Déconnecter toutes les sessions
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: Utilisateur | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      telephone: [''],
      cin: [{ value: '', disabled: true }]
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (u) => {
        this.user = u;
        this.profileForm.patchValue({
          nom: u.nom, prenom: u.prenom, email: u.email,
          telephone: u.telephone || '', cin: u.cin
        });
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;
    const { nom, prenom, telephone } = this.profileForm.getRawValue();
    this.userService.updateProfile({ nom, prenom, telephone }).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.toastService.success('Profil mis à jour avec succès');
        this.profileForm.markAsPristine();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur lors de la mise à jour du profil')
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.toastService.error('Les mots de passe ne correspondent pas');
      return;
    }
    this.authService.changePassword({ currentPassword, newPassword, confirmPassword }).subscribe({
      next: () => { this.toastService.success('Mot de passe modifié avec succès'); this.passwordForm.reset(); },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur lors du changement de mot de passe')
    });
  }

  toggle2FA(): void {
    if (!this.user) return;
    const enable = !this.user.doubleFacteurActif;
    this.authService.toggle2FA(enable).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.toastService.success(enable ? '2FA activée avec succès' : '2FA désactivée');
      },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur lors de la mise à jour 2FA')
    });
  }

  logoutAll(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success('Toutes les sessions ont été fermées');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
