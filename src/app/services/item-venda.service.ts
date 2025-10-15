import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemVenda } from '../vendas/item-venda.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemVendaService {
  private apiUrl = 'http://localhost:8000/api/itens-venda';

  constructor(private http: HttpClient) {}

  listar(): Observable<ItemVenda[]> {
    return this.http.get<ItemVenda[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<ItemVenda> {
    return this.http.get<ItemVenda>(`${this.apiUrl}/${id}`);
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}