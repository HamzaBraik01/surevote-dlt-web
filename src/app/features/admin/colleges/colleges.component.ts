import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollegeService } from '../../../core/services/college.service';
import { ToastService } from '../../../core/services/toast.service';
import { CollegeElectoral } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-colleges',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ConfirmModalComponent],
  template: `
    <header class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-on-surface">Collèges Électoraux</h1>
        <p class="text-on-surface-variant mt-1 text-sm">Gérez les groupes d'électeurs.</p>
      </div>
      <button (click)="showCreate = true"
        class="px-6 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">add</span> Nouveau Collège
      </button>
    </header>

    @if (loading) {
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else {
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (c of colleges; track c.id) {
        <div class="bg-surface-container-lowest rounded-xl p-6 hover:shadow-sm transition-all">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">school</span>
            </div>
            <div>
              <h3 class="font-bold text-on-surface">{{ c.nom }}</h3>
              <p class="text-xs text-on-surface-variant">Créé le {{ c.dateCreation | date:'dd/MM/yyyy' }}</p>
            </div>
          </div>
          <p class="text-sm text-on-surface-variant mb-4 line-clamp-2">{{ c.description }}</p>
          <div class="flex gap-2">
            <a [routerLink]="['/admin/colleges', c.id]" class="text-xs text-primary font-bold hover:underline">Voir détails</a>
            <button (click)="confirmDelete(c)" class="text-xs text-rose-600 font-bold hover:underline">Supprimer</button>
          </div>
        </div>
      }
    </div>

    @if (!loading && colleges.length === 0) {
      <div class="text-center py-16 bg-surface-container-lowest rounded-xl text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl mb-4">school</span>
        <p class="font-medium">Aucun collège électoral.</p>
      </div>
    }
    }

    @if (showCreate) {
      <div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="showCreate = false">
        <div class="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-on-surface mb-6">Nouveau Collège</h2>
          <form [formGroup]="form" (ngSubmit)="create()" class="space-y-4">
            <input formControlName="nom" placeholder="Nom du collège" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
            <textarea formControlName="description" rows="3" placeholder="Description" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
            <div class="flex gap-4 pt-4">
              <button type="button" (click)="showCreate = false" class="flex-1 py-3 bg-surface-container-high text-on-secondary-container font-bold rounded-xl">Annuler</button>
              <button type="submit" [disabled]="form.invalid" class="flex-1 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg disabled:opacity-50">Créer</button>
            </div>
          </form>
        </div>
      </div>
    }

    <app-confirm-modal
      [visible]="showDeleteConfirm"
      title="Supprimer le collège"
      [message]="'Voulez-vous vraiment supprimer ce collège ? Cette action est irréversible.'"
      confirmText="Supprimer"
      type="danger"
      (confirmed)="doDelete()"
      (cancelled)="showDeleteConfirm = false"
    />
  `
})
export class AdminCollegesComponent implements OnInit {
  colleges: CollegeElectoral[] = [];
  showCreate = false;
  showDeleteConfirm = false;
  collegeToDelete: CollegeElectoral | null = null;
  loading = true;
  form: FormGroup;

  constructor(private collegeService: CollegeService, private toastService: ToastService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({ nom: ['', Validators.required], description: [''] });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.collegeService.list().subscribe({
      next: (d) => { this.colleges = d; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); this.toastService.error('Erreur lors du chargement des collèges'); }
    });
  }

  create(): void {
    if (this.form.invalid) return;
    this.collegeService.create(this.form.value).subscribe({
      next: () => { this.showCreate = false; this.toastService.success('Collège créé'); this.form.reset(); this.load(); },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }

  confirmDelete(c: CollegeElectoral): void {
    this.collegeToDelete = c;
    this.showDeleteConfirm = true;
  }

  doDelete(): void {
    if (!this.collegeToDelete) return;
    this.showDeleteConfirm = false;
    this.collegeService.delete(this.collegeToDelete.id).subscribe({
      next: () => { this.toastService.success('Collège supprimé'); this.load(); },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur lors de la suppression')
    });
    this.collegeToDelete = null;
  }
}
