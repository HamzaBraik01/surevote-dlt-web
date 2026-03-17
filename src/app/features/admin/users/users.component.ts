import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { Utilisateur, UserRole, PageResponse } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  template: `
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-on-surface">Gestion des Utilisateurs</h1>
        <p class="text-on-surface-variant mt-1 text-sm">Gérez les comptes et les rôles.</p>
      </div>
      <button (click)="showCreateModal = true"
        class="px-6 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">person_add</span> Nouveau
      </button>
    </header>

    <!-- Filter -->
    <div class="bg-surface-container-lowest p-4 rounded-xl mb-6 flex items-center gap-4">
      <div class="flex-1 relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
        <input [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Rechercher..."
          class="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl border-transparent text-sm focus:ring-2 focus:ring-primary outline-none" />
      </div>
      @for (r of roles; track r) {
        <button (click)="filterRole(r)" class="px-3 py-2 text-xs font-bold rounded-xl transition-colors"
          [class]="activeRole === r ? 'bg-primary text-white' : 'bg-surface-container-high text-on-secondary-container hover:bg-surface-variant'">
          {{ r }}
        </button>
      }
      <button (click)="activeRole = ''; loadUsers()" class="px-3 py-2 text-xs font-bold bg-surface-container-high text-on-secondary-container rounded-xl hover:bg-surface-variant">Tous</button>
    </div>

    <!-- Loading -->
    @if (loading) {
      <div class="flex justify-center py-16">
        <div class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else {
      <!-- Table -->
      <div class="bg-surface-container-lowest rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-surface-container-low">
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nom</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">CIN</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Rôle</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Statut</th>
              <th class="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm font-medium">
            @for (u of pagedUsers; track u.id) {
              <tr class="hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/5 last:border-b-0">
                <td class="px-6 py-4 font-bold text-on-surface">{{ u.prenom }} {{ u.nom }}</td>
                <td class="px-6 py-4 text-on-surface-variant">{{ u.email }}</td>
                <td class="px-6 py-4 text-on-surface-variant font-mono text-xs">{{ u.cin }}</td>
                <td class="px-6 py-4">
                  <select [ngModel]="u.role" (change)="onRoleChange(u, $event)"
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold border-none focus:ring-0 cursor-pointer appearance-none text-center"
                    [class]="u.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-700' : u.role === 'OBSERVATEUR' ? 'bg-purple-500/10 text-purple-700' : 'bg-emerald-500/10 text-emerald-700'">
                    <option value="ELECTEUR">ELECTEUR</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OBSERVATEUR">OBSERVATEUR</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <span class="flex items-center gap-1.5 text-xs font-bold" [class]="u.actif ? 'text-emerald-600' : 'text-rose-600'">
                    <span class="w-1.5 h-1.5 rounded-full" [class]="u.actif ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    {{ u.actif ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  @if (u.actif) {
                    <button (click)="deactivate(u)" class="text-rose-600 text-xs font-bold hover:underline">Désactiver</button>
                  } @else {
                    <button (click)="activate(u)" class="text-emerald-600 text-xs font-bold hover:underline">Activer</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10">
          <p class="text-sm text-on-surface-variant font-medium">Page {{ currentPage + 1 }} sur {{ totalPages || 1 }} · {{ totalElements }} utilisateurs</p>
          <div class="flex space-x-2">
            <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
              class="p-2 bg-surface-container-high rounded-lg disabled:opacity-40 hover:bg-surface-container-highest transition-colors">
              <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
              class="p-2 bg-primary text-white rounded-lg disabled:opacity-40 hover:opacity-90 transition-colors">
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Create Modal -->
    @if (showCreateModal) {
      <div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="showCreateModal = false">
        <div class="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-on-surface mb-6">Nouvel Utilisateur</h2>
          <form [formGroup]="createForm" (ngSubmit)="createUser()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <input formControlName="nom" placeholder="Nom" class="px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
              <input formControlName="prenom" placeholder="Prénom" class="px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
            </div>
            <input formControlName="cin" placeholder="CIN" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
            <input formControlName="email" type="email" placeholder="Email" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
            <select formControlName="role" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm">
              <option value="ELECTEUR">Électeur</option>
              <option value="ADMIN">Administrateur</option>
              <option value="OBSERVATEUR">Observateur</option>
            </select>
            <div class="flex gap-4 pt-4">
              <button type="button" (click)="showCreateModal = false" class="flex-1 py-3 bg-surface-container-high text-on-secondary-container font-bold rounded-xl">Annuler</button>
              <button type="submit" [disabled]="createForm.invalid" class="flex-1 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg disabled:opacity-50">Créer</button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class AdminUsersComponent implements OnInit {
  users: Utilisateur[] = [];
  pagedUsers: Utilisateur[] = [];
  searchQuery = '';
  activeRole = '';
  roles: UserRole[] = ['ADMIN', 'ELECTEUR', 'OBSERVATEUR'];
  showCreateModal = false;
  loading = true;
  createForm: FormGroup;

  currentPage = 0;
  totalPages = 1;
  totalElements = 0;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm = this.fb.group({
      cin: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['ELECTEUR', Validators.required],
      generateRandomPassword: [true]
    });
  }

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading = true;
    this.userService.listPaged(this.currentPage, 10).subscribe({
      next: (res: PageResponse<Utilisateur>) => {
        this.pagedUsers = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  goToPage(p: number): void {
    if (p >= 0 && p < this.totalPages) {
      this.currentPage = p;
      this.loadUsers();
    }
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    if (q.trim()) {
      this.userService.search(q).subscribe({
        next: (d) => { this.pagedUsers = d; this.totalPages = 1; this.totalElements = d.length; }
      });
    } else {
      this.currentPage = 0;
      this.loadUsers();
    }
  }

  filterRole(role: string): void {
    this.activeRole = role;
    this.userService.listByRole(role).subscribe({
      next: (d) => { this.pagedUsers = d; this.totalPages = 1; this.totalElements = d.length; }
    });
  }

  onRoleChange(u: Utilisateur, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value as UserRole;
    if (newRole === u.role) return;
    this.userService.updateRole(u.id, { role: newRole }).subscribe({
      next: () => { this.toastService.success('Rôle mis à jour'); this.loadUsers(); },
      error: () => this.toastService.error('Erreur lors du changement de rôle')
    });
  }

  deactivate(u: Utilisateur): void {
    this.userService.deactivatePut(u.id).subscribe({
      next: () => { this.toastService.success('Utilisateur désactivé'); this.loadUsers(); },
      error: () => this.toastService.error('Erreur')
    });
  }

  activate(u: Utilisateur): void {
    this.userService.activate(u.id).subscribe({
      next: () => { this.toastService.success('Utilisateur activé'); this.loadUsers(); },
      error: () => this.toastService.error('Erreur')
    });
  }

  createUser(): void {
    if (this.createForm.invalid) return;
    this.userService.create(this.createForm.value).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.toastService.success('Utilisateur créé');
        this.createForm.reset({ role: 'ELECTEUR', generateRandomPassword: true });
        this.loadUsers();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }
}
