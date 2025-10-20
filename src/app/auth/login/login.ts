import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  erro = '';
  resetPasswordEmail = '';
  resetMessage = '';
  showResetForm = false;

  constructor(private authService: AuthService, private router: Router) {}

  
  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: { token: string }) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.erro = 'Credenciais inválidas porque ' + (err.error?.message || 'Erro desconhecido');
      },
    });
  }

  resetPassword() {
    this.authService.resetPassword(this.resetPasswordEmail).subscribe({
      next: (res: { message: string }) => {
        this.resetMessage = res.message;
      },
      error: (err: any) => {
        this.resetMessage = err.error?.message || 'Erro ao redefinir a senha';
      },
    });
  }

}