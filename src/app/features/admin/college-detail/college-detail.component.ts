import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollegeService } from '../../../core/services/college.service';
import { ToastService } from '../../../core/services/toast.service';
import { CollegeElectoral, CollegeMember } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-college-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ConfirmModalComponent],
  template: `
    <a routerLink="/admin/colleges" class="text-sm text-primary font-semibold hover:underline flex items-center gap-1 mb-6">
      <span class="material-symbols-outlined text-sm">arrow_back</span> Retour aux collèges
    </a>

    @if (college) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- College Info -->
        <div class="lg:col-span-2">
          <div class="bg-surface-container-lowest rounded-xl p-8 mb-8">
            <h1 class="text-2xl font-bold text-on-surface mb-2">{{ college.nom }}</h1>
            <p class="text-on-surface-variant text-sm mb-4">{{ college.description }}</p>
            <div class="flex items-center gap-4 text-sm text-on-surface-variant">
              <span><strong class="text-on-surface">{{ members.length }}</strong> membres</span>
              <span>Créé le {{ college.dateCreation | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <!-- Members List -->
          <div class="bg-surface-container-lowest rounded-xl p-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-on-surface">Membres du collège</h2>
              <button (click)="showAddMember = !showAddMember"
                class="px-4 py-2 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">person_add</span> Ajouter
              </button>
            </div>

            @if (showAddMember) {
              <form [formGroup]="addForm" (ngSubmit)="addMember()" class="bg-surface-container-low rounded-xl p-6 mb-6 flex items-end gap-4">
                <div class="flex-1 space-y-1">
                  <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">ID Électeur</label>
                  <input formControlName="electeurId" type="number" placeholder="Ex: 42"
                    class="w-full px-4 py-2.5 bg-surface-container-lowest rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
                </div>
                <button type="submit" [disabled]="addForm.invalid"
                  class="px-4 py-2.5 hero-gradient text-white text-sm font-bold rounded-xl disabled:opacity-50">Ajouter</button>
                <button type="button" (click)="showAddMember = false"
                  class="px-4 py-2.5 bg-surface-container-high text-on-secondary-container text-sm font-semibold rounded-xl">Annuler</button>
              </form>
            }

            @if (members.length === 0) {
              <div class="text-center py-12 text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl mb-2">group_off</span>
                <p class="font-medium text-sm">Aucun membre dans ce collège.</p>
              </div>
            } @else {
              <div class="space-y-2">
                @for (m of members; track m.id) {
                  <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                        {{ m.prenom?.[0] || '?' }}{{ m.nom?.[0] || '?' }}
                      </div>
                      <div>
                        <p class="font-bold text-on-surface text-sm">{{ m.prenom }} {{ m.nom }}</p>
                        <p class="text-xs text-on-surface-variant">{{ m.email }} · CIN: {{ m.cin }}</p>
                      </div>
                    </div>
                    <button (click)="removeMember(m)" class="text-rose-600 text-xs font-bold hover:underline flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">person_remove</span> Retirer
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <div class="bg-surface-container-lowest rounded-xl p-6">
            <h3 class="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Statistiques</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm p-3 bg-surface-container-low rounded-xl">
                <span class="text-on-surface-variant font-medium">Total Membres</span>
                <span class="font-bold text-primary">{{ members.length }}</span>
              </div>
            </div>
          </div>
          <div class="bg-surface-container-lowest rounded-xl p-6">
            <h3 class="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Actions</h3>
            <button (click)="deleteCollege()" class="w-full py-3 bg-rose-500/10 text-rose-800 font-bold rounded-xl hover:bg-rose-500/20 transition-colors text-sm">
              Supprimer ce collège
            </button>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal
      [visible]="showConfirm"
      [title]="confirmTitle"
      [message]="confirmMessage"
      [confirmText]="confirmBtnText"
      [type]="confirmType"
      (confirmed)="onConfirmed()"
      (cancelled)="showConfirm = false"
    />
  `
})
export class CollegeDetailComponent implements OnInit {
  college: CollegeElectoral | null = null;
  members: CollegeMember[] = [];
  showAddMember = false;
  addForm: FormGroup;

  showConfirm = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmBtnText = 'Confirmer';
  confirmType: 'danger' | 'warning' = 'danger';
  private pendingAction: (() => void) | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collegeService: CollegeService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.addForm = this.fb.group({ electeurId: ['', Validators.required] });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.collegeService.getById(id).subscribe({
      next: (c) => { this.college = c; this.cdr.markForCheck(); },
      error: () => this.toastService.error('Erreur lors du chargement du collège')
    });
    this.loadMembers(id);
  }

  loadMembers(id: number): void {
    this.collegeService.listMembers(id).subscribe({
      next: (m) => { this.members = m; this.cdr.markForCheck(); },
      error: () => this.toastService.error('Erreur lors du chargement des membres')
    });
  }

  addMember(): void {
    if (!this.college || this.addForm.invalid) return;
    const { electeurId } = this.addForm.value;
    this.collegeService.addVoter(this.college.id, { electeurId: Number(electeurId) }).subscribe({
      next: () => {
        this.toastService.success('Membre ajouté');
        this.addForm.reset();
        this.showAddMember = false;
        this.loadMembers(this.college!.id);
      },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }

  removeMember(m: CollegeMember): void {
    if (!this.college) return;
    this.confirmTitle = 'Retirer le membre';
    this.confirmMessage = `Retirer ${m.prenom} ${m.nom} du collège ?`;
    this.confirmBtnText = 'Retirer';
    this.confirmType = 'danger';
    this.pendingAction = () => {
      this.collegeService.removeVoter(this.college!.id, m.id).subscribe({
        next: () => { this.toastService.success('Membre retiré'); this.loadMembers(this.college!.id); },
        error: (err) => this.toastService.error(err.error?.message || 'Erreur lors du retrait')
      });
    };
    this.showConfirm = true;
  }

  deleteCollege(): void {
    if (!this.college) return;
    this.confirmTitle = 'Supprimer le collège';
    this.confirmMessage = `Supprimer "${this.college.nom}" ? Cette action est irréversible.`;
    this.confirmBtnText = 'Supprimer';
    this.confirmType = 'danger';
    this.pendingAction = () => {
      this.collegeService.delete(this.college!.id).subscribe({
        next: () => { this.toastService.success('Collège supprimé'); this.router.navigate(['/admin/colleges']); },
        error: (err) => this.toastService.error(err.error?.message || 'Erreur lors de la suppression')
      });
    };
    this.showConfirm = true;
  }

  onConfirmed(): void {
    this.showConfirm = false;
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = null;
    }
  }
}
