import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { ProdutoService } from '../produto.service';
import { Router } from '@angular/router';

interface Categoria {
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  codigo_barras: string;
  preco: number;
  quantidade: number;
  categoria?: Categoria;
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
  private produtoService = inject(ProdutoService);
  private router = inject(Router);

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categorias: Categoria[] = [];

  filtros = {
    data_inicio: '',
    data_fim: '',
    produto_id: '',
  };

  filtroNome = '';
  filtroCategoria = '';
  precoMin: number | null = null;
  precoMax: number | null = null;

  ngOnInit(): void {
    this.carregarProdutos();
     this.carregarCategorias();
  }

  
irParaCadastro(): void {
    this.router.navigate(['/produtos/cadastro']);
  }


  carregarProdutos(): void {
    this.http.get<Produto[]>('http://localhost:8000/api/produtos', {
      headers: this.headers,
    }).subscribe((res) => {
      console.log('Produtos recebidos:', res);
      this.produtos = res;
      this.produtosFiltrados = [...res]; // Inicializa com todos os produtos
    });
  }

  aplicarFiltros(): void {
    this.produtosFiltrados = this.produtos.filter((p) => {
      const nomeMatch = p.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      const categoriaMatch = !this.filtroCategoria || p.categoria?.nome === this.filtroCategoria;
      const precoMatch =
        (!this.precoMin || p.preco >= this.precoMin) &&
        (!this.precoMax || p.preco <= this.precoMax);
      return nomeMatch && categoriaMatch && precoMatch;
    });
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroCategoria = '';
    this.precoMin = null;
    this.precoMax = null;
    this.produtosFiltrados = [...this.produtos];
  }

  ordenarPor(campo: 'nome' | 'preco'): void {
    this.produtosFiltrados.sort((a, b) => {
      if (a[campo] < b[campo]) return -1;
      if (a[campo] > b[campo]) return 1;
      return 0;
    });
  }

  carregarCategorias(): void {
  this.http.get<Categoria[]>('http://localhost:8000/api/categorias', {
    headers: this.headers,
  }).subscribe((res) => {
    this.categorias = res;
  });
}

  exportarCSV(): void {
    // lógica para exportar produtosFiltrados como CSV
    // posso te ajudar com isso se quiser
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    });
  }
}