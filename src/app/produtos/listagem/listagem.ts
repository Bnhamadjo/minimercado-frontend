import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listagem-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './listagem.html',
  styleUrls: ['./listagem.scss'],
})
export class ListagemComponent {
  private http = inject(HttpClient);

  vendas: any[] = [];
  produtos: any[] = [];

  filtros = {
    data_inicio: '',
    data_fim: '',
    produto_id: '',
  };

  ngOnInit(): void {
    this.carregarProdutos();
    this.buscarVendas();
  }

  get headers() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  carregarProdutos() {
    this.http.get('http://localhost:8000/api/produtos', { headers: this.headers }).subscribe((res: any) => {
      this.produtos = res;
    });
  }

  buscarVendas() {
    const params: any = {};
    if (this.filtros.data_inicio) params.data_inicio = this.filtros.data_inicio;
    if (this.filtros.data_fim) params.data_fim = this.filtros.data_fim;
    if (this.filtros.produto_id) params.produto_id = this.filtros.produto_id;

    this.http.get('http://localhost:8000/api/vendas', { headers: this.headers, params }).subscribe((res: any) => {
      this.vendas = res;
    });
  }
}