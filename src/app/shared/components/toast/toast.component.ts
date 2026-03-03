import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[100] space-y-3 max-w-sm w-full">
      @for (toast of (toastService.toasts | async); track toast.id) {
        <div class="flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border animate-[slideIn_0.3s_ease-out]"
          [class]="getToastClasses(toast)">
          <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">
            {{ getIcon(toast) }}
          </span>
          <span class="text-sm font-medium flex-1">{{ toast.message }}</span>
          <button (click)="toastService.dismiss(toast.id)" class="opacity-60 hover:opacity-100 transition-opacity">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getToastClasses(toast: Toast): string {
    const base = 'bg-surface-container-lowest border-outline-variant/20';
    switch (toast.type) {
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }

  getIcon(toast: Toast): string {
    switch (toast.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }
}
