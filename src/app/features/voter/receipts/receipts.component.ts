import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../core/services/vote.service';
import { VoteReceipt } from '../../../core/models';

@Component({
  selector: 'app-voter-receipts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Mes Reçus de Vote</h1>
    <p class="text-on-surface-variant text-lg mb-10">Consultez et vérifiez vos reçus cryptographiques.</p>

    @if (loading) {
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    } @else if (receipts.length === 0) {
      <div class="text-center py-20 bg-surface-container-lowest rounded-xl text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl mb-4">receipt_long</span>
        <p class="font-medium">Aucun reçu de vote pour le moment.</p>
      </div>
    } @else {
      <div class="space-y-4">
        @for (r of receipts; track r.id) {
          <div class="bg-surface-container-lowest rounded-xl p-6 flex items-center justify-between hover:shadow-sm transition-all">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-emerald-600" style="font-variation-settings: 'FILL' 1;">verified</span>
              </div>
              <div>
                <p class="font-bold text-on-surface">{{ r.electionTitre || 'Élection #' + r.electionId }}</p>
                <p class="text-xs text-on-surface-variant">{{ r.dateVote | date:'dd MMM yyyy à HH:mm' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-on-surface-variant uppercase mb-1">Reçu</p>
              <p class="font-mono text-sm text-primary font-bold">{{ r.recuCryptographique | slice:0:20 }}...</p>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class VoterReceiptsComponent implements OnInit {
  receipts: VoteReceipt[] = [];
  loading = true;

  constructor(private voteService: VoteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.voteService.getMyVotes().subscribe({
      next: (data) => { this.receipts = data; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }
}
