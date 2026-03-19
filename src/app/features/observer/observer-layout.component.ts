import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-observer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <app-sidebar />
    <main class="md:ml-64 min-h-screen bg-surface p-4 md:p-8">
      <router-outlet />
    </main>
  `
})
export class ObserverLayoutComponent {}
