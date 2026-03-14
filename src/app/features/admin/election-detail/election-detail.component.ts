import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectionService } from '../../../core/services/election.service';
import { CandidatService } from '../../../core/services/candidat.service';
import { FileService } from '../../../core/services/file.service';
import { ToastService } from '../../../core/services/toast.service';
import { Election, Candidat, ElectionResult, CandidatResult } from '../../../core/models';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-election-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatusBadgeComponent, ConfirmModalComponent],
  template: `
    <div class="mb-6">
      <a routerLink="/admin/elections" class="text-sm text-primary font-semibold hover:underline flex items-center gap-1 mb-4">
        <span class="material-symbols-outlined text-sm">arrow_back</span> Retour aux élections
      </a>
    </div>

    @if (loading) {
      <div class="flex justify-center py-20">
        <div class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else if (election) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Election Info / Edit -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-surface-container-lowest rounded-xl p-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                @if (!editMode) {
                  <h1 class="text-2xl font-bold text-on-surface mb-2">{{ election.titre }}</h1>
                } @else {
                  <h2 class="text-lg font-bold text-on-surface mb-4">Modifier l'élection</h2>
                }
                <app-status-badge [status]="election.statut" [pulse]="election.statut === 'OUVERTE'"></app-status-badge>
              </div>
              @if (election.statut === 'BROUILLON' && !editMode) {
                <button (click)="startEdit()" class="px-4 py-2 bg-surface-container-high text-on-secondary-container text-sm font-bold rounded-xl hover:bg-surface-variant transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">edit</span> Modifier
                </button>
              }
            </div>

            @if (editMode) {
              <form [formGroup]="editForm" (ngSubmit)="saveEdit()" class="space-y-4">
                <div class="space-y-1">
                  <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Titre</label>
                  <input formControlName="titre" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Description</label>
                  <textarea formControlName="description" rows="3" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date début</label>
                    <input formControlName="dateDebut" type="datetime-local" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date fin</label>
                    <input formControlName="dateFin" type="datetime-local" class="w-full px-4 py-3 bg-surface-container-low rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div class="flex gap-3 pt-2">
                  <button type="button" (click)="editMode = false" class="flex-1 py-3 bg-surface-container-high text-on-secondary-container font-bold rounded-xl">Annuler</button>
                  <button type="submit" [disabled]="editForm.invalid || editForm.pristine" class="flex-1 py-3 hero-gradient text-white font-bold rounded-xl shadow-lg disabled:opacity-50">Enregistrer</button>
                </div>
              </form>
            } @else {
              <p class="text-on-surface-variant text-sm mb-6">{{ election.description }}</p>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-surface-container-low rounded-xl p-4">
                  <p class="text-xs font-bold text-on-surface-variant uppercase mb-1">Date début</p>
                  <p class="text-sm font-semibold text-on-surface">{{ election.dateDebut | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
                <div class="bg-surface-container-low rounded-xl p-4">
                  <p class="text-xs font-bold text-on-surface-variant uppercase mb-1">Date fin</p>
                  <p class="text-sm font-semibold text-on-surface">{{ election.dateFin | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
            }
          </div>

          <!-- Candidates -->
          <div class="bg-surface-container-lowest rounded-xl p-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-bold text-on-surface">Candidats ({{ candidates.length }})</h2>
              @if (election.statut === 'BROUILLON' || election.statut === 'PLANIFIEE') {
                <button (click)="showAddCandidate = !showAddCandidate"
                  class="px-4 py-2 hero-gradient text-white text-sm font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">person_add</span> Ajouter
                </button>
              }
            </div>

            @if (showAddCandidate) {
              <form [formGroup]="candidateForm" (ngSubmit)="addCandidate()" class="bg-surface-container-low rounded-xl p-6 mb-6 space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <input formControlName="nom" placeholder="Nom" class="px-4 py-2.5 bg-surface-container-lowest rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
                  <input formControlName="prenom" placeholder="Prénom" class="px-4 py-2.5 bg-surface-container-lowest rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
                </div>
                <input formControlName="affiliationOuParti" placeholder="Parti / Affiliation" class="w-full px-4 py-2.5 bg-surface-container-lowest rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm" />
                <textarea formControlName="biographie" rows="2" placeholder="Biographie" class="w-full px-4 py-2.5 bg-surface-container-lowest rounded-xl border-transparent focus:ring-2 focus:ring-primary outline-none text-sm resize-none"></textarea>
                <div class="flex gap-3">
                  <button type="button" (click)="showAddCandidate = false" class="px-4 py-2 bg-surface-container-high text-on-secondary-container text-sm font-semibold rounded-xl">Annuler</button>
                  <button type="submit" [disabled]="candidateForm.invalid" class="px-4 py-2 hero-gradient text-white text-sm font-bold rounded-xl disabled:opacity-50">Ajouter</button>
                </div>
              </form>
            }

            @if (candidates.length === 0) {
              <div class="text-center py-8 text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl mb-2">person_search</span>
                <p class="font-medium text-sm">Aucun candidat enregistré.</p>
              </div>
            } @else {
              <div class="space-y-3">
                @for (c of candidates; track c.id) {
                  <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors">
                    <div class="flex items-center gap-4">
                      <div class="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold overflow-hidden">
                        @if (c.photoUrl) {
                          <img [src]="getFileUrl(c.photoUrl)" [alt]="c.nom" class="w-full h-full object-cover" />
                        } @else {
                          {{ c.prenom[0] }}{{ c.nom[0] }}
                        }
                      </div>
                      <div>
                        <p class="font-bold text-on-surface text-sm">{{ c.prenom }} {{ c.nom }}</p>
                        <p class="text-xs text-on-surface-variant">{{ c.affiliationOuParti }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <!-- File upload buttons -->
                      @if (election.statut === 'BROUILLON' || election.statut === 'PLANIFIEE') {
                        <label class="cursor-pointer p-2 hover:bg-surface-container-high rounded-lg transition-colors" title="Photo">
                          <span class="material-symbols-outlined text-sm text-blue-600">photo_camera</span>
                          <input type="file" accept="image/*" (change)="uploadPhoto(c, $event)" class="hidden" />
                        </label>
                        <label class="cursor-pointer p-2 hover:bg-surface-container-high rounded-lg transition-colors" title="Programme PDF">
                          <span class="material-symbols-outlined text-sm text-amber-600">upload_file</span>
                          <input type="file" accept=".pdf" (change)="uploadProgram(c, $event)" class="hidden" />
                        </label>
                        <button (click)="confirmDeleteCandidate(c)" class="p-2 hover:bg-rose-50 rounded-lg transition-colors" title="Supprimer">
                          <span class="material-symbols-outlined text-sm text-rose-600">delete</span>
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Results Section (CLOTUREE / PUBLIEE) -->
          @if (election.statut === 'CLOTUREE' || election.statut === 'PUBLIEE') {
            <div class="bg-surface-container-lowest rounded-xl p-8">
              <h2 class="text-lg font-bold text-on-surface mb-6">Résultats du scrutin</h2>
              @if (resultsLoading) {
                <div class="flex justify-center py-8">
                  <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              } @else if (results) {
                <div class="grid grid-cols-3 gap-4 mb-8">
                  <div class="bg-surface-container-low rounded-xl p-4 text-center">
                    <p class="text-xs font-bold text-on-surface-variant uppercase mb-1">Votes totaux</p>
                    <p class="text-2xl font-black text-primary">{{ results.totalVotes }}</p>
                  </div>
                  <div class="bg-surface-container-low rounded-xl p-4 text-center">
                    <p class="text-xs font-bold text-on-surface-variant uppercase mb-1">Participation</p>
                    <p class="text-2xl font-black text-on-surface">{{ results.tauxParticipation | number:'1.1-1' }}%</p>
                  </div>
                  <div class="bg-surface-container-low rounded-xl p-4 text-center">
                    <p class="text-xs font-bold text-on-surface-variant uppercase mb-1">Blancs</p>
                    <p class="text-2xl font-black text-on-surface-variant">{{ results.voteBlanc || 0 }}</p>
                  </div>
                </div>
                <div class="space-y-4">
                  @for (r of results.resultats; track r.candidatId) {
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {{ r.prenom?.[0] || '?' }}{{ r.nom?.[0] || '?' }}
                      </div>
                      <div class="flex-1">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-sm font-bold text-on-surface">{{ r.prenom }} {{ r.nom }}</span>
                          <span class="text-sm font-bold text-primary">{{ r.pourcentage | number:'1.1-1' }}%</span>
                        </div>
                        <div class="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div class="h-full bg-primary rounded-full transition-all duration-700" [style.width.%]="r.pourcentage"></div>
                        </div>
                        <p class="text-xs text-on-surface-variant mt-1">{{ r.nombreVoix }} voix · {{ r.affiliationOuParti }}</p>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-on-surface-variant text-sm text-center py-4">Aucun résultat disponible.</p>
              }
            </div>
          }
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
          <div class="bg-surface-container-lowest rounded-xl p-6">
            <h3 class="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Actions</h3>
            <div class="space-y-3">
              @if (election.statut === 'BROUILLON') {
                <button (click)="transition('plan')" class="w-full py-3 bg-amber-500/10 text-amber-800 font-bold rounded-xl hover:bg-amber-500/20 transition-colors text-sm">Planifier</button>
              }
              @if (election.statut === 'PLANIFIEE') {
                <button (click)="transition('open')" class="w-full py-3 bg-emerald-500/10 text-emerald-800 font-bold rounded-xl hover:bg-emerald-500/20 transition-colors text-sm">Ouvrir</button>
              }
              @if (election.statut === 'OUVERTE') {
                <button (click)="transition('close')" class="w-full py-3 bg-rose-500/10 text-rose-800 font-bold rounded-xl hover:bg-rose-500/20 transition-colors text-sm">Clôturer</button>
              }
              @if (election.statut === 'CLOTUREE') {
                <button (click)="transition('publish')" class="w-full py-3 hero-gradient text-white font-bold rounded-xl shadow-lg text-sm">Publier</button>
              }
            </div>
          </div>

          <div class="bg-gradient-to-br from-inverse-surface to-slate-800 rounded-xl p-6 text-white">
            <span class="material-symbols-outlined text-2xl mb-3">shield</span>
            <h3 class="font-bold mb-1">Intégrité</h3>
            <p class="text-slate-300 text-xs leading-relaxed">Vérifiez l'intégrité cryptographique du scrutin.</p>
            <button (click)="checkIntegrity()" class="mt-4 text-xs font-bold underline underline-offset-4 hover:text-white">Lancer la vérification</button>
          </div>
        </div>
      </div>
    }

    <!-- Delete Candidate Confirm Modal -->
    <app-confirm-modal
      [visible]="candidateToDelete !== null"
      title="Supprimer le candidat"
      [message]="'Supprimer ' + (candidateToDelete?.prenom || '') + ' ' + (candidateToDelete?.nom || '') + ' ? Cette action est irréversible.'"
      confirmText="Supprimer"
      type="danger"
      (confirmed)="doDeleteCandidate()"
      (cancelled)="candidateToDelete = null"
    ></app-confirm-modal>
  `
})
export class ElectionDetailComponent implements OnInit {
  election: Election | null = null;
  candidates: Candidat[] = [];
  results: ElectionResult | null = null;
  resultsLoading = false;
  loading = true;
  editMode = false;
  showAddCandidate = false;
  candidateToDelete: Candidat | null = null;

  editForm: FormGroup;
  candidateForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private candidatService: CandidatService,
    private fileService: FileService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.editForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required]
    });
    this.candidateForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      affiliationOuParti: ['', Validators.required],
      biographie: ['']
    });
  }

  private get electionId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadElection();
  }

  loadElection(): void {
    this.loading = true;
    this.electionService.getById(this.electionId).subscribe({
      next: (e) => {
        this.election = e;
        this.loading = false;
        this.cdr.markForCheck();
        this.loadCandidates();
        if (e.statut === 'CLOTUREE' || e.statut === 'PUBLIEE') {
          this.loadResults();
        }
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); this.toastService.error('Élection introuvable'); }
    });
  }

  loadCandidates(): void {
    this.candidatService.listByElection(this.electionId).subscribe({
      next: (c) => { this.candidates = c; this.cdr.markForCheck(); },
      error: () => {}
    });
  }

  loadResults(): void {
    this.resultsLoading = true;
    this.electionService.getResults(this.electionId).subscribe({
      next: (r) => { this.results = r; this.resultsLoading = false; this.cdr.markForCheck(); },
      error: () => { this.resultsLoading = false; this.cdr.markForCheck(); }
    });
  }

  // ── Edit ─────────────────────────────────────────────────
  startEdit(): void {
    if (!this.election) return;
    this.editForm.patchValue({
      titre: this.election.titre,
      description: this.election.description,
      dateDebut: this.formatDateForInput(this.election.dateDebut),
      dateFin: this.formatDateForInput(this.election.dateFin)
    });
    this.editMode = true;
  }

  saveEdit(): void {
    if (!this.election || this.editForm.invalid) return;
    this.electionService.update(this.election.id, this.editForm.value).subscribe({
      next: (e) => { this.election = e; this.editMode = false; this.toastService.success('Élection mise à jour'); },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }

  private formatDateForInput(iso: string): string {
    if (!iso) return '';
    return iso.substring(0, 16); // yyyy-MM-ddTHH:mm
  }

  // ── Candidates ──────────────────────────────────────────
  addCandidate(): void {
    if (!this.election || this.candidateForm.invalid) return;
    this.candidatService.add(this.election.id, this.candidateForm.value).subscribe({
      next: () => {
        this.toastService.success('Candidat ajouté');
        this.candidateForm.reset();
        this.showAddCandidate = false;
        this.loadCandidates();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }

  confirmDeleteCandidate(c: Candidat): void {
    this.candidateToDelete = c;
  }

  doDeleteCandidate(): void {
    if (!this.candidateToDelete) return;
    this.candidatService.delete(this.candidateToDelete.id).subscribe({
      next: () => { this.toastService.success('Candidat supprimé'); this.candidateToDelete = null; this.loadCandidates(); },
      error: () => { this.toastService.error('Erreur'); this.candidateToDelete = null; }
    });
  }

  // ── File uploads ────────────────────────────────────────
  uploadPhoto(c: Candidat, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.fileService.uploadCandidatePhoto(c.id, file).subscribe({
      next: () => { this.toastService.success('Photo mise à jour'); this.loadCandidates(); },
      error: () => this.toastService.error('Erreur d\'upload')
    });
  }

  uploadProgram(c: Candidat, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.fileService.uploadCandidateProgram(c.id, file).subscribe({
      next: () => { this.toastService.success('Programme mis à jour'); this.loadCandidates(); },
      error: () => this.toastService.error('Erreur d\'upload')
    });
  }

  getFileUrl(path: string): string {
    return this.fileService.getDownloadUrl(path);
  }

  // ── Lifecycle ───────────────────────────────────────────
  transition(action: string): void {
    if (!this.election) return;
    const call = action === 'plan' ? this.electionService.plan(this.election.id) :
                 action === 'open' ? this.electionService.open(this.election.id) :
                 action === 'close' ? this.electionService.close(this.election.id) :
                 this.electionService.publish(this.election.id);
    call.subscribe({
      next: (e) => {
        this.election = e;
        this.toastService.success('Statut mis à jour');
        if (e.statut === 'CLOTUREE' || e.statut === 'PUBLIEE') this.loadResults();
      },
      error: (err) => this.toastService.error(err.error?.message || 'Erreur')
    });
  }

  checkIntegrity(): void {
    if (!this.election) return;
    this.electionService.verifyIntegrity(this.election.id).subscribe({
      next: (r) => this.toastService.success(r.integre ? 'Intégrité vérifiée ✓' : 'Anomalie détectée !'),
      error: () => this.toastService.error('Erreur lors de la vérification')
    });
  }
}
