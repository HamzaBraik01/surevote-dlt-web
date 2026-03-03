import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" (click)="onCancel()">
        <div class="bg-surface-container-lowest rounded-xl p-8 w-full max-w-md whisper-shadow animate-in" (click)="$event.stopPropagation()">
          <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
              [class]="type === 'danger' ? 'bg-rose-500/10' : 'bg-amber-500/10'">
              <span class="material-symbols-outlined text-3xl"
                [class]="type === 'danger' ? 'text-rose-600' : 'text-amber-600'"
                style="font-variation-settings: 'FILL' 1;">
                {{ type === 'danger' ? 'warning' : 'help' }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-on-surface mb-2">{{ title }}</h2>
            <p class="text-sm text-on-surface-variant leading-relaxed">{{ message }}</p>
          </div>
          <div class="flex gap-4">
            <button (click)="onCancel()"
              class="flex-1 py-3 bg-surface-container-high text-on-secondary-container font-bold rounded-xl hover:bg-surface-variant transition-colors">
              {{ cancelText }}
            </button>
            <button (click)="onConfirm()"
              class="flex-1 py-3 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
              [class]="type === 'danger' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'hero-gradient text-white hover:opacity-90'">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr ?';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';
  @Input() type: 'danger' | 'warning' = 'warning';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void { this.confirmed.emit(); }
  onCancel(): void { this.cancelled.emit(); }
}
