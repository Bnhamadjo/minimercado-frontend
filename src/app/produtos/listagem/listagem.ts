import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

interface Produto {
  id: number;
  nome: string;
  codigo_barras: string;
  preco: number;
  quantidade?: number; // Estoque real
  categoria?: { nome: string };
}

@Component({
  selector: 'app-listagem-vendas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './listagem.html',
  styleUrls: ['./listagem.scss'],
})
export class ListagemComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categorias: any[] = [];
  movimentacoes: any[] = [];
  vendas: any[] = [];

  // filtros e campos do template
  filtroNome = '';
  filtroCategoria = '';
  precoMin: number | null = null;
  precoMax: number | null = null;

  ngOnInit(): void {
    this.carregarTudo();
    this.carregarCategorias();
  }

  carregarTudo() {
    const headers = this.headers;

    forkJoin({
      produtos: this.http.get<Produto[]>('http://localhost:8000/api/produtos', { headers }),
      movimentacoes: this.http.get<any[]>('http://localhost:8000/api/estoque/movimentacoes', { headers }),
      vendas: this.http.get<any[]>('http://localhost:8000/api/vendas', { headers }),
    }).subscribe({
      next: ({ produtos, movimentacoes, vendas }) => {
        this.movimentacoes = movimentacoes;
        this.vendas = vendas;

        this.produtos = produtos.map(p => ({
          ...p,
          quantidade: this.getEstoqueReal(p.id)
        }));

        this.produtosFiltrados = [...this.produtos];
      },
      error: err => console.error('Erro ao carregar dados', err)
    });
  }

  carregarCategorias() {
    this.http.get<any[]>('http://localhost:8000/api/categorias', { headers: this.headers })
      .subscribe(res => this.categorias = res);
  }

  getEstoqueReal(produtoId: number): number {
    const entradas = this.movimentacoes
      .filter(m => m.produto_id === produtoId && m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.quantidade, 0);

    const vendasProduto = this.vendas
      .flatMap(v => v.itens || [])
      .filter(i => i.produto_id === produtoId)
      .reduce((sum, i) => sum + i.quantidade, 0);

    return entradas - vendasProduto;
  }

  // ---------------- FILTROS ----------------
  aplicarFiltros() {
    this.produtosFiltrados = this.produtos.filter(p => {
      const nomeMatch = p.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      const categoriaMatch = !this.filtroCategoria || p.categoria?.nome === this.filtroCategoria;
      const precoMatch = (!this.precoMin || p.preco >= this.precoMin) &&
                         (!this.precoMax || p.preco <= this.precoMax);
      return nomeMatch && categoriaMatch && precoMatch;
    });
  }

  limparFiltros() {
    this.filtroNome = '';
    this.filtroCategoria = '';
    this.precoMin = null;
    this.precoMax = null;
    this.produtosFiltrados = [...this.produtos];
  }

  ordenarPor(campo: 'nome' | 'preco') {
    this.produtosFiltrados.sort((a, b) => (a[campo] < b[campo] ? -1 : (a[campo] > b[campo] ? 1 : 0)));
  }

  exportarCSV() {
    const linhas = [
      ['Nome', 'Código de Barras', 'Preço', 'Estoque', 'Categoria'],
      ...this.produtosFiltrados.map(p => [
        p.nome,
        p.codigo_barras,
        Number(p.preco).toFixed(2).replace('.', ','),
        p.quantidade?.toString() || '0',
        p.categoria?.nome || ''
      ])
    ];
    const csvContent = linhas.map(l => l.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'produtos.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  irParaCadastro() {
    this.router.navigate(['/produtos/cadastro']);
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });
  }
}
