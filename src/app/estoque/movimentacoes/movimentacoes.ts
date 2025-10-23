import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-movimentacoes-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './movimentacoes.html',
  styleUrls: ['./movimentacoes.scss'],
})
export class MovimentacoesEstoqueComponent {
  private http = inject(HttpClient);

  produtos: any[] = [];
  movimentacoes: any[] = [];
  vendas: any[] = [];

  novaMovimentacao = {
    produto_id: '',
    tipo: 'entrada',
    quantidade: 1,
    motivo: '',
  };

  
filtros = {
  data_inicio: '',
  data_fim: '',
  tipo: '',
};


  ngOnInit(): void {
    const headers = this.getHeaders();

    this.http.get('http://localhost:8000/api/produtos', { headers }).subscribe((res: any) => {
      this.produtos = res;
    });

    this.http.get('http://localhost:8000/api/estoque/movimentacoes', { headers }).subscribe((res: any) => {
      this.movimentacoes = res;
    });
  }

  registrarMovimentacao() {
    const headers = this.getHeaders();

    this.http.post('http://localhost:8000/api/estoque/movimentacoes', this.novaMovimentacao, { headers }).subscribe(() => {
      alert('Movimentação registrada!');
      this.novaMovimentacao = { produto_id: '', tipo: 'entrada', quantidade: 1, motivo: '' };
      this.ngOnInit(); // recarrega dados
    });
  }

buscarMovimentacoes() {
  const headers = this.getHeaders();
  const params: any = {};

  if (this.filtros.data_inicio) params.data_inicio = this.filtros.data_inicio;
  if (this.filtros.data_fim) params.data_fim = this.filtros.data_fim;
  if (this.filtros.tipo) params.tipo = this.filtros.tipo;

  this.http.get('http://localhost:8000/api/estoque/movimentacoes', { headers, params }).subscribe((res: any) => {
    this.movimentacoes = res;
  });
}

getEstoque(produtoId: string): number {
  const produto = this.produtos.find(p => p.id === produtoId);
  return produto ? produto.estoque : 0;
}

  getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }


}