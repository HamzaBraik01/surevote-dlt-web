import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VoteService } from '../../../core/services/vote.service';
import { CandidatService } from '../../../core/services/candidat.service';
import { FileService } from '../../../core/services/file.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Candidat, VoteReceipt, EligibilityResponse } from '../../../core/models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-voting-booth',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  template: `
    <!-- Focus Mode Bars -->
    <div class="fixed top-0 left-0 w-1 h-full bg-primary z-50"></div>
    <div class="fixed top-0 right-0 w-1 h-full bg-primary z-50"></div>

    <!-- Header -->
    <header class="bg-surface-container-lowest z-40 relative">
      <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <span class="text-primary font-black tracking-tighter text-2xl">SUREVOTE</span>
          <div class="h-6 w-[1px] bg-outline-variant/30 hidden md:block"></div>
          <div>
            <h1 class="font-bold text-on-surface tracking-tight">Isoloir Numérique</h1>
            <p class="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Session Sécurisée</p>
          </div>
        </div>

        <!-- Stepper -->
        <div class="flex items-center gap-2 md:gap-4 flex-1 max-w-2xl justify-end">
          @for (s of steps; track s.num; let i = $index) {
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                [class]="step >= s.num ? 'bg-primary text-on-primary ring-4 ring-primary-fixed' : 'bg-surface-variant text-on-surface-variant'"
                [class.opacity-40]="step < s.num">{{ s.num }}</div>
              <span class="text-sm font-medium hidden md:block" [class]="step >= s.num ? 'text-primary font-semibold' : 'text-on-surface-variant opacity-40'">{{ s.label }}</span>
            </div>
            @if (i < steps.length - 1) {
              <div class="h-[2px] w-8 md:w-16" [class]="step > s.num ? 'bg-primary' : 'bg-surface-variant'"></div>
            }
          }
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
      <!-- STEP 1: Choose -->
      @if (step === 1) {
        <div class="mb-12 text-center max-w-3xl mx-auto">
          <h2 class="text-4xl font-extrabold text-on-surface tracking-tight mb-4">Sélectionnez votre candidat</h2>
          <p class="text-on-surface-variant text-lg leading-relaxed">Votre vote est anonyme et chiffré de bout en bout.</p>
        </div>

        @if (loading) {
          <div class="flex justify-center py-20"><div class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (c of candidates; track c.id) {
              <div class="bg-surface-container-lowest rounded-3xl overflow-hidden group hover:ring-2 transition-all duration-300"
                [class]="selectedCandidat?.id === c.id ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : 'hover:ring-primary/20'">
                <div class="aspect-[4/3] w-full relative overflow-hidden bg-surface-container-low">
                  @if (c.photoUrl) {
                    <img [src]="getPhotoUrl(c.photoUrl)" [alt]="c.prenom + ' ' + c.nom"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-fixed to-surface-container-low">
                      <span class="text-5xl font-black text-primary/30">{{ c.prenom[0] }}{{ c.nom[0] }}</span>
                    </div>
                  }
                  @if (c.affiliationOuParti) {
                    <div class="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                      <span class="text-[10px] font-bold tracking-widest text-primary uppercase">{{ c.affiliationOuParti }}</span>
                    </div>
                  }
                  @if (selectedCandidat?.id === c.id) {
                    <div class="absolute top-4 right-4 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <span class="material-symbols-outlined text-sm">check</span>
                    </div>
                  }
                </div>
                <div class="p-8">
                  <h3 class="text-2xl font-bold text-on-surface leading-tight mb-1">{{ c.prenom }} {{ c.nom }}</h3>
                  <p class="text-on-surface-variant font-medium mb-6">{{ c.affiliationOuParti || 'Indépendant' }}</p>
                  <div class="flex flex-col gap-3">
                    <button (click)="selectCandidate(c)"
                      class="w-full py-4 px-6 rounded-xl font-bold tracking-tight transition-all"
                      [class]="selectedCandidat?.id === c.id ? 'bg-primary text-white shadow-lg' : 'hero-gradient text-on-primary hover:shadow-lg active:scale-[0.98]'">
                      {{ selectedCandidat?.id === c.id ? '✓ Sélectionné' : 'Choisir ce candidat' }}
                    </button>
                    @if (c.programmePdfUrl) {
                      <a [href]="getFileUrl(c.programmePdfUrl!)" target="_blank"
                        class="w-full py-3 px-6 bg-surface-container-low text-on-surface-variant rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">description</span> Voir le programme (PDF)
                      </a>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Blank Vote -->
            <div class="bg-surface-container-low rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed transition-all"
              [class]="isBlankVote ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant/30 hover:border-primary/40'">
              <div class="w-20 h-20 rounded-full bg-surface-container-lowest flex items-center justify-center mb-6 shadow-sm">
                <span class="material-symbols-outlined text-4xl text-outline">block</span>
              </div>
              <h3 class="text-xl font-bold text-on-surface mb-2">Vote Blanc</h3>
              <p class="text-sm text-on-surface-variant mb-8 max-w-[200px]">Exprimer votre neutralité envers les candidats.</p>
              <button (click)="selectBlank()"
                class="px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95"
                [class]="isBlankVote ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface hover:shadow-md'">
                {{ isBlankVote ? '✓ Vote Blanc Sélectionné' : 'Choisir Vote Blanc' }}
              </button>
            </div>
          </div>

          @if (selectedCandidat || isBlankVote) {
            <div class="flex justify-end mt-10">
              <button (click)="step = 2"
                class="px-8 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
                Continuer <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          }
        }
      }

      <!-- STEP 2: Verify -->
      @if (step === 2) {
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold text-on-surface mb-4">Vérification de votre choix</h2>
          <p class="text-on-surface-variant mb-10">Veuillez confirmer votre sélection avant de soumettre votre vote.</p>
          <div class="bg-surface-container-lowest rounded-xl p-8 whisper-shadow mb-8">
            @if (isBlankVote) {
              <div class="flex items-center justify-center gap-4">
                <span class="material-symbols-outlined text-4xl text-outline">block</span>
                <h3 class="text-2xl font-bold text-on-surface">Vote Blanc</h3>
              </div>
            } @else if (selectedCandidat) {
              <div class="flex items-center gap-6">
                @if (selectedCandidat.photoUrl) {
                  <img [src]="getPhotoUrl(selectedCandidat.photoUrl)" class="w-24 h-24 rounded-xl object-cover" />
                } @else {
                  <div class="w-24 h-24 rounded-xl bg-primary-fixed flex items-center justify-center text-primary text-2xl font-black">
                    {{ selectedCandidat.prenom[0] }}{{ selectedCandidat.nom[0] }}
                  </div>
                }
                <div class="text-left">
                  <h3 class="text-2xl font-bold text-on-surface">{{ selectedCandidat.prenom }} {{ selectedCandidat.nom }}</h3>
                  <p class="text-on-surface-variant font-medium">{{ selectedCandidat.affiliationOuParti || 'Indépendant' }}</p>
                </div>
              </div>
            }
          </div>
          <div class="flex gap-4 justify-center">
            <button (click)="step = 1" class="px-8 py-3 bg-surface-container-high text-on-secondary-container font-bold rounded-xl hover:bg-surface-variant transition-colors">
              <span class="material-symbols-outlined text-sm align-middle">arrow_back</span> Modifier
            </button>
            <button (click)="showConfirm = true"
              class="px-8 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
              Confirmer mon vote <span class="material-symbols-outlined">how_to_vote</span>
            </button>
          </div>
        </div>
      }

      <!-- STEP 3: Confirmation -->
      @if (step === 3 && receipt) {
        <div class="max-w-2xl mx-auto text-center">
          <div class="mb-8">
            <div class="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <span class="material-symbols-outlined text-5xl text-emerald-600" style="font-variation-settings: 'FILL' 1;">task_alt</span>
            </div>
            <h2 class="text-3xl font-extrabold text-on-surface mb-2">Vote Enregistré</h2>
            <p class="text-on-surface-variant">Votre vote a été chiffré et enregistré avec succès.</p>
          </div>
          <div class="bg-surface-container-lowest rounded-xl p-8 whisper-shadow mb-8 text-left">
            <h3 class="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Reçu Cryptographique</h3>
            <div class="bg-surface-container-low p-4 rounded-xl font-mono text-xs text-on-surface break-all mb-4">
              {{ receipt.recuCryptographique }}
            </div>
            <p class="text-xs text-on-surface-variant">Date: {{ receipt.dateVote | date:'dd/MM/yyyy HH:mm:ss' }}</p>
          </div>
          <button routerLink="/voter/dashboard" class="px-8 py-4 hero-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all">
            Retour au tableau de bord
          </button>
        </div>
      }
    </main>

    <!-- Footer -->
    <footer class="bg-surface-container-lowest py-4 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between text-xs text-on-surface-variant font-medium">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Connexion Sécurisée AES-256
          </div>
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px]">lock</span> Session expire dans {{ sessionTimer }}
          </div>
        </div>
        <div class="hidden sm:block">Besoin d'aide ? Appelez le 0800-VOTE-SURE</div>
      </div>
    </footer>

    <!-- Confirm Modal -->
    <app-confirm-modal
      [visible]="showConfirm"
      title="Confirmation Finale"
      [message]="isBlankVote ? 'Confirmez-vous votre vote blanc ? Cette action est irréversible.' : 'Confirmez-vous votre vote pour ' + (selectedCandidat?.prenom || '') + ' ' + (selectedCandidat?.nom || '') + ' ? Cette action est irréversible.'"
      confirmText="Confirmer le vote"
      type="warning"
      (confirmed)="submitVote()"
      (cancelled)="showConfirm = false"
    />
  `
})
export class VotingBoothComponent implements OnInit, OnDestroy {
  candidates: Candidat[] = [];
  selectedCandidat: Candidat | null = null;
  isBlankVote = false;
  receipt: VoteReceipt | null = null;
  step = 1;
  loading = true;
  showConfirm = false;
  sessionTimer = '15:00';
  private timerInterval: any;
  private electionId!: number;

  steps = [
    { num: 1, label: 'Choix' },
    { num: 2, label: 'Vérification' },
    { num: 3, label: 'Confirmation' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private voteService: VoteService,
    private candidatService: CandidatService,
    private fileService: FileService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('electionId'));
    this.startSessionTimer();

    this.voteService.checkEligibility(this.electionId).subscribe({
      next: (res: EligibilityResponse) => {
        if (!res.eligible) {
          this.toastService.error(res.raison || 'Vous n\'êtes pas éligible pour cette élection.');
          this.router.navigate(['/voter/dashboard']);
          return;
        }
        if (res.aDejaVote) {
          this.toastService.info('Vous avez déjà voté pour cette élection.');
          this.router.navigate(['/voter/dashboard']);
          return;
        }
        this.loadCandidates();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); this.toastService.error('Erreur de vérification d\'éligibilité'); }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private loadCandidates(): void {
    this.candidatService.getPublicCandidates(this.electionId).subscribe({
      next: (d) => { this.candidates = d; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  private startSessionTimer(): void {
    let seconds = 15 * 60;
    this.timerInterval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(this.timerInterval);
        this.toastService.error('Session expirée');
        this.router.navigate(['/voter/dashboard']);
        return;
      }
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      this.sessionTimer = `${m}:${s}`;
    }, 1000);
  }

  selectCandidate(c: Candidat): void {
    this.isBlankVote = false;
    this.selectedCandidat = this.selectedCandidat?.id === c.id ? null : c;
  }

  selectBlank(): void {
    this.selectedCandidat = null;
    this.isBlankVote = !this.isBlankVote;
  }

  submitVote(): void {
    this.showConfirm = false;
    const candidatId = this.isBlankVote ? 0 : (this.selectedCandidat?.id || 0);
    this.voteService.submitVote({ electionId: this.electionId, candidatId }).subscribe({
      next: (r) => { this.receipt = r; this.step = 3; this.cdr.markForCheck(); this.toastService.success('Vote enregistré avec succès !'); },
      error: (err) => { this.cdr.markForCheck(); this.toastService.error(err.error?.message || 'Erreur lors du vote'); }
    });
  }

  getPhotoUrl(path: string): string { return this.fileService.getDownloadUrl(path); }
  getFileUrl(path: string): string { return this.fileService.getDownloadUrl(path); }
}
