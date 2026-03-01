import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (overlay) {
      <div class="fixed inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          @if (message) {
            <p class="text-sm font-medium text-on-surface-variant">{{ message }}</p>
          }
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center py-8">
        <div class="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    }
  `
})
export class LoadingSpinnerComponent {
  @Input() overlay = false;
  @Input() message = '';
}
