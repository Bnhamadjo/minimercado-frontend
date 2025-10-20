import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './services/auth';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    
    
    SidebarComponent
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