import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venda } from '../vendas/venda.model';


@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = 'http://localhost:8000/api/vendas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`);
  }

  criar(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(this.apiUrl, venda);
  }

  atualizar(id: number, venda: Venda): Observable<Venda> {
    return this.http.put<Venda>(`${this.apiUrl}/${id}`, venda);
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}