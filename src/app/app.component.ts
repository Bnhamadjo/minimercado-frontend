import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './services/auth';
import { HeaderComponent } from './header/header';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  protected readonly title = signal('minimercado-frontend');

  // app.component.ts
constructor(private authService: AuthService) {}

get isLoggedIn(): boolean {
  return this.authService.isAuthenticated();
}
}