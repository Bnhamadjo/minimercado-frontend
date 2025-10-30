import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ProdutoDetalhesComponent } from './produto-detalhes.component';

@Component({
  selector: 'app-movimentacoes-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatDialogModule],
  templateUrl: './movimentacoes.html',
  styleUrls: ['./movimentacoes.scss']
})
export class MovimentacoesEstoqueComponent implements OnInit {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  produtos: any[] = [];
  movimentacoes: any[] = [];
  vendas: any[] = []; // vendas do sistema para calcular estoque real

  novaMovimentacao = {
    produto_id: '',
    tipo: 'entrada',
    quantidade: 1,
    motivo: '',
    data_validade: ''
  };

  filtros = {
    data_inicio: '',
    data_fim: '',
    tipo: '',
    produto_id: '',
    data_validade:'',
  };

  // -------------------- PAGINAÇÃO --------------------
paginaAtual = 1;
itensPorPagina = 7;
movimentacoesPaginadas: any[] = [];
totalPaginas = 1;


  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarMovimentacoes();
    this.carregarVendas();

    setInterval(() => this.carregarMovimentacoes(), 60000); // atualização automática
  }

  // -------------------- CARREGAR DADOS --------------------
  carregarProdutos() {
    const headers = this.getHeaders();
    this.http.get('http://localhost:8000/api/produtos', { headers })
      .subscribe((res: any) => this.produtos = res);
  }

  carregarMovimentacoes() {
  const headers = this.getHeaders();
  this.http.get('http://localhost:8000/api/estoque/movimentacoes', { headers })
    .subscribe((res: any) => {
      this.movimentacoes = res;
      this.paginaAtual = 1;
      this.atualizarPaginacao();
    });
}


  carregarVendas() {
    const headers = this.getHeaders();
    this.http.get('http://localhost:8000/api/vendas', { headers })
      .subscribe((res: any) => this.vendas = res);
  }

  // -------------------- MOVIMENTAÇÕES --------------------
  registrarMovimentacao() {
    if (!this.novaMovimentacao.produto_id || this.novaMovimentacao.quantidade <= 0) {
      alert('Preencha todos os campos obrigatórios e quantidade válida.');
      return;
    }

    const headers = this.getHeaders();
    this.http.post('http://localhost:8000/api/estoque/movimentacoes', this.novaMovimentacao, { headers })
      .subscribe({
        next: () => {
          alert('Movimentação registrada!');
          this.novaMovimentacao = { produto_id: '', tipo: 'entrada', quantidade: 1, motivo: '', data_validade:'' };
          this.carregarMovimentacoes();
        },
        error: (err) => {
          console.error('Erro ao registrar movimentação:', err);
          alert('Erro ao registrar movimentação. Verifique os dados ou a conexão com o servidor.');
        }
      });
  }

  buscarMovimentacoes() {
  const headers = this.getHeaders();
  const params: any = {};
  if (this.filtros.data_inicio) params.data_inicio = this.filtros.data_inicio;
  if (this.filtros.data_fim) params.data_fim = this.filtros.data_fim;
  if (this.filtros.tipo) params.tipo = this.filtros.tipo;
  if (this.filtros.produto_id) params.produto_id = this.filtros.produto_id;

  this.http.get('http://localhost:8000/api/estoque/movimentacoes', { headers, params })
    .subscribe((res: any) => {
      this.movimentacoes = res;
      this.paginaAtual = 1;
      this.atualizarPaginacao();
    });
}


  // -------------------- ESTOQUE E VENDAS --------------------
  getEstoque(produtoId: string): number {
    // Entradas manuais
    const entradas = this.movimentacoes
      .filter(m => m.produto_id === produtoId && m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.quantidade, 0);

    // Saídas manuais
    const saidasMovimentacao = this.movimentacoes
      .filter(m => m.produto_id === produtoId && m.tipo === 'saida')
      .reduce((sum, m) => sum + m.quantidade, 0);

    // Saídas automáticas das vendas
    const vendas = this.vendas
      .filter(v => v.itens.some((i: any) => i.produto.id === produtoId))
      .reduce((sum, v) => {
        const item = v.itens.find((i: any) => i.produto.id === produtoId);
        return sum + (item?.quantidade || 0);
      }, 0);

    return entradas - saidasMovimentacao - vendas;
  }

  getTotalVendido(produtoId: string): number {
    // Apenas vendas do sistema
    return this.vendas
      .filter(v => v.itens.some((i: any) => i.produto.id === produtoId))
      .reduce((sum, v) => {
        const item = v.itens.find((i: any) => i.produto.id === produtoId);
        return sum + (item?.quantidade || 0);
      }, 0);
  }

  getEstoqueAviso(produtoId: string): string {
    const estoque = this.getEstoque(produtoId);
    if (estoque <= 5) return '⚠️ Estoque baixo!';
    return '';
  }

  // -------------------- MODAL DETALHES --------------------
  abrirDetalhes(produtoId: string) {
    const produto = this.produtos.find(p => p.id === produtoId);
    if (!produto) return;

    const estoqueAtual = this.getEstoque(produtoId);
    const totalVendido = this.getTotalVendido(produtoId);
    const movimentacoesProduto = this.movimentacoes.filter(m => m.produto_id === produtoId);

    this.dialog.open(ProdutoDetalhesComponent, {
      width: '700px',
      data: { produto, estoque: estoqueAtual, totalVendido, movimentacoes: movimentacoesProduto }
    });
  }

  // -------------------- EXPORTAÇÃO --------------------
  exportarExcel() {
    if (!this.movimentacoes.length) return;

    const ws = XLSX.utils.json_to_sheet(this.movimentacoes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimentacoes');
    XLSX.writeFile(wb, 'movimentacoes.xlsx');
  }

  getAvisoValidade(data_validade: string | null | undefined): string {
  if (!data_validade) return '-';

  const hoje = new Date();
  const validade = new Date(data_validade);

  // diferença em dias
  const diffMs = validade.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    return '❌ Vencido';
  } else if (diffDias <= 7) {
    return '⚠️ Vence em ' + diffDias + ' dias';
  } else if (diffDias <= 30) {
    return '⏳ Próximo do vencimento';
  } else {
    return '✅ Dentro do prazo';
  }
}

atualizarPaginacao() {
  this.totalPaginas = Math.ceil(this.movimentacoes.length / this.itensPorPagina);
  const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
  const fim = inicio + this.itensPorPagina;
  this.movimentacoesPaginadas = this.movimentacoes.slice(inicio, fim);
}

proximaPagina() {
  if (this.paginaAtual < this.totalPaginas) {
    this.paginaAtual++;
    this.atualizarPaginacao();
  }
}

paginaAnterior() {
  if (this.paginaAtual > 1) {
    this.paginaAtual--;
    this.atualizarPaginacao();
  }
}


  // -------------------- HEADERS --------------------
  getHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }
}
