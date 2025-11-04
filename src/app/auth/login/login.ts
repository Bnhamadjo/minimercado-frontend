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
    if (!this.email || !this.password) {
      this.erro = 'Preencha e-mail e senha';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (res: { token: string }) => {
        // Armazena token
        localStorage.setItem('token', res.token);

        // Decodifica payload do JWT para pegar role e nome
        try {
          const payload = JSON.parse(atob(res.token.split('.')[1]));
          localStorage.setItem('role', payload.role);
          localStorage.setItem('name', payload.name);
        } catch (e) {
          console.warn('Erro ao decodificar token:', e);
        }

        // Redireciona para dashboard
        this.router.navigate(['/dashboard']);
      },
      (err: any) => {
        this.erro = 'Credenciais inválidas: ' + (err.error?.message || 'Erro desconhecido');
      }
    );
  }

  resetPassword() {
    if (!this.resetPasswordEmail) {
      this.resetMessage = 'Informe o e-mail';
      return;
    }

    this.authService.resetPassword(this.resetPasswordEmail).subscribe(
      (res: { message: string }) => {
        this.resetMessage = res.message;
      },
      (err: any) => {
        this.resetMessage = err.error?.message || 'Erro ao redefinir a senha';
      }
    );
  }
}
