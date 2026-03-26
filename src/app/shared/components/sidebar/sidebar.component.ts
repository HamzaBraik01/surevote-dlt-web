import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile hamburger -->
    <button (click)="mobileOpen = !mobileOpen"
      class="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface-container-lowest rounded-xl shadow-lg">
      <span class="material-symbols-outlined text-on-surface">{{ mobileOpen ? 'close' : 'menu' }}</span>
    </button>

    <!-- Backdrop -->
    @if (mobileOpen) {
      <div class="md:hidden fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-40" (click)="mobileOpen = false"></div>
    }

    <aside [class]="sidebarClass"
      class="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col p-4 space-y-2 z-40 transition-transform duration-300">
      <!-- Brand -->
      <div class="mb-8 px-2 py-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">shield_lock</span>
          <span class="text-lg font-black text-primary uppercase tracking-tighter">SUREVOTE</span>
        </div>
        <div class="mt-4 flex items-center space-x-3">
          <div class="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
            {{ userInitials }}
          </div>
          <div>
            <p class="text-sm font-bold text-on-surface">{{ userName }}</p>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-widest">{{ portalLabel }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-1 overflow-y-auto">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-surface-container-lowest text-primary shadow-sm"
            (click)="closeMobile()"
            class="flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high/50 rounded-xl transition-transform duration-200 hover:translate-x-1">
            <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="mt-auto pt-6 border-t border-outline-variant/10 space-y-1">
        <button (click)="toggleDark()" class="w-full flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high/50 rounded-xl transition-transform duration-200 hover:translate-x-1">
          <span class="material-symbols-outlined text-[20px]">{{ isDark() ? 'light_mode' : 'dark_mode' }}</span>
          <span class="text-sm font-medium">{{ isDark() ? 'Mode clair' : 'Mode sombre' }}</span>
        </button>
        <a [routerLink]="settingsRoute" (click)="closeMobile()"
          class="flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high/50 rounded-xl transition-transform duration-200 hover:translate-x-1">
          <span class="material-symbols-outlined text-[20px]">settings</span>
          <span class="text-sm font-medium">Paramètres</span>
        </a>
        <button (click)="onLogout()" class="w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-transform duration-200 hover:translate-x-1">
          <span class="material-symbols-outlined text-[20px]">logout</span>
          <span class="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  navItems: NavItem[] = [];
  adminItems: NavItem[] = [];
  observerItems: NavItem[] = [];
  mobileOpen = false;

  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {
    this.buildNav();
  }

  get isDark() { return this.themeService.isDark; }
  toggleDark(): void { this.themeService.toggle(); }

  get sidebarClass(): string {
    return this.mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0';
  }

  get userName(): string {
    const u = this.authService.currentUser;
    return u ? `${u.prenom} ${u.nom}` : 'Utilisateur';
  }

  get userInitials(): string {
    const u = this.authService.currentUser;
    return u ? `${u.prenom[0]}${u.nom[0]}` : 'SV';
  }

  get portalLabel(): string {
    const role = this.authService.userRole;
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'OBSERVATEUR': return 'Observateur';
      default: return 'Identité Vérifiée';
    }
  }

  get isAdmin(): boolean {
    return this.authService.userRole === 'ADMIN';
  }

  get isObserver(): boolean {
    return this.authService.userRole === 'OBSERVATEUR' || this.authService.userRole === 'ADMIN';
  }

  get settingsRoute(): string {
    const role = this.authService.userRole;
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/voter/profile';
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }

  private buildNav(): void {
    const role = this.authService.userRole;

    if (role === 'ADMIN') {
      // Admin gets admin sections only, no voter routes
      this.navItems = [
        { label: 'Vue d\'ensemble', icon: 'analytics', route: '/admin/dashboard' },
        { label: 'Élections', icon: 'ballot', route: '/admin/elections' },
        { label: 'Candidats', icon: 'person_search', route: '/admin/candidates' },
        { label: 'Utilisateurs', icon: 'group', route: '/admin/users' },
        { label: 'Collèges', icon: 'school', route: '/admin/colleges' },
      ];
      this.adminItems = [];
    } else if (role === 'OBSERVATEUR') {
      this.navItems = [
        { label: 'Métriques', icon: 'analytics', route: '/observer/dashboard' },
        { label: 'Journal d\'audit', icon: 'security', route: '/observer/audit' },
      ];
      this.adminItems = [];
    } else {
      // Default: Voter/Elector
      this.navItems = [
        { label: 'Tableau de bord', icon: 'dashboard', route: '/voter/dashboard' },
        { label: 'Mes Reçus', icon: 'receipt_long', route: '/voter/receipts' },
      ];
      this.adminItems = [];
    }

    this.observerItems = [];
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
