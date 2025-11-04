import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
  return new Observable(observer => {
    this.http.post<{ token: string, user: any }>(
      `${this.apiUrl}/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        observer.next({ token: res.token }); // envia o token como esperado
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  });
}

getUser(): any {
  return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

getRole(): string {
  return this.getUser().role || '';
}

isAdmin(): boolean {
  return this.getRole() === 'admin';
}

canAccess(componente: string): boolean {
  const role = this.getRole();
  if (role === 'admin') return true;

  // Define permissões do usuário comum
  const permissoesUsuario: any = {
    estoque: true,
    vendas: true,
    produto: true,
    usuarios: false
  };

  return permissoesUsuario[componente] || false;
}



resetPassword(email: string) {
  return this.http.post<{ message: string }>(
    `${this.apiUrl}/reset-password`,
    { email, new_password: '123456' },
    { headers: { 'Content-Type': 'application/json' } }
  );
}


  logout(): void {
  const token = localStorage.getItem('token');
  if (!token) return;

  this.http.post(`${this.apiUrl}/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: () => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    },
    error: () => {
      localStorage.removeItem('token'); // garante logout mesmo se erro
      window.location.href = '/login';
    }
  });
}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
