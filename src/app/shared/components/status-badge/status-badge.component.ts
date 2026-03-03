import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center" [ngClass]="badgeClass">
      @if (pulse) {
        <span class="w-1.5 h-1.5 rounded-full mr-2 animate-pulse" [ngClass]="dotClass"></span>
      }
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() pulse = false;

  get label(): string {
    const labels: Record<string, string> = {
      'BROUILLON': 'Brouillon', 'PLANIFIEE': 'Planifiée', 'OUVERTE': 'Ouverte',
      'CLOTUREE': 'Clôturée', 'PUBLIEE': 'Publiée'
    };
    return labels[this.status] || this.status;
  }

  get badgeClass(): Record<string, boolean> {
    return {
      'bg-emerald-500/15 text-emerald-700': this.status === 'OUVERTE' || this.status === 'PUBLIEE',
      'bg-amber-500/15 text-amber-800': this.status === 'PLANIFIEE',
      'bg-slate-500/15 text-slate-700': this.status === 'BROUILLON',
      'bg-rose-500/15 text-rose-700': this.status === 'CLOTUREE',
    };
  }

  get dotClass(): Record<string, boolean> {
    return {
      'bg-emerald-600': this.status === 'OUVERTE' || this.status === 'PUBLIEE',
      'bg-amber-600': this.status === 'PLANIFIEE',
      'bg-slate-600': this.status === 'BROUILLON',
      'bg-rose-600': this.status === 'CLOTUREE',
    };
  }
}
