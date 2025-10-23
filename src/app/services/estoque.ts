import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService {
  private baseUrl = 'http://localhost:8000/api';
  private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
}

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produtos`, { headers: this.getHeaders() });
  }

  getMovimentacoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/estoque/movimentacoes`, { headers: this.getHeaders() });
  }

  getVendas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vendas`, { headers: this.getHeaders() });
  }
}