import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
