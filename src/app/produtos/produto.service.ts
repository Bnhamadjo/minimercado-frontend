import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from './produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  constructor(private http: HttpClient) {}

  getProdutos() {
    return this.http.get<Produto[]>('http://localhost:8000/api/produtos');
  }
}