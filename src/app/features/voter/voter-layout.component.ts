import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-voter-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent],
  template: `
    <app-sidebar />
    <main class="md:ml-64 min-h-screen bg-surface flex flex-col">
      <div class="flex-1 p-4 md:p-8">
        <router-outlet />
      </div>
      <app-footer />
    </main>
  `
})
export class VoterLayoutComponent {}
