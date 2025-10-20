import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(
    `${this.apiUrl}/login`,
    { email, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
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
