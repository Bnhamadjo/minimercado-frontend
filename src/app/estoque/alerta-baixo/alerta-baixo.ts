import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EstoqueService } from '../../services/estoque';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alerta-baixo-estoque',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './alerta-baixo.html',
  styleUrls: ['./alerta-baixo.scss'],
})
export class AlertaBaixoEstoqueComponent {
  @Input() limiteMinimo: number = 10;
  @Output() alertaAtualizado = new EventEmitter<void>();

  produtos: any[] = [];
  movimentacoes: any[] = [];
  vendas: any[] = [];
  produtosBaixoEstoque: any[] = [];

  // Filtros
  filtroNome: string = '';
  filtroCategoria: string = '';
  categorias: string[] = [];

  constructor(private estoqueService: EstoqueService) {}

  ngOnInit(): void {
    this.verificarEstoque();
  }

  get produtosFiltrados(): any[] {
    return this.produtosBaixoEstoque.filter(p => {
      const nomeMatch = p.nome.toLowerCase().includes(this.filtroNome.toLowerCase());
      const categoriaMatch = this.filtroCategoria ? p.categoria?.nome === this.filtroCategoria : true;
      return nomeMatch && categoriaMatch;
    });
  }

  verificarEstoque(): void {
    this.estoqueService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
      this.categorias = [...new Set(produtos.map(p => p.categoria?.nome).filter(Boolean))];

      this.estoqueService.getMovimentacoes().subscribe(movs => {
        this.movimentacoes = movs;

        this.estoqueService.getVendas().subscribe(vendas => {
          this.vendas = vendas;

          this.calcularEstoqueAtual();
          this.alertaAtualizado.emit();
        });
      });
    });
  }

  calcularEstoqueAtual(): void {
    this.produtosBaixoEstoque = this.produtos.filter(produto => {
      const entradas = this.movimentacoes
        .filter(m => m.produto_id === produto.id && m.tipo === 'entrada')
        .reduce((acc, m) => acc + m.quantidade, 0);

      const saidasMov = this.movimentacoes
        .filter(m => m.produto_id === produto.id && m.tipo === 'saida')
        .reduce((acc, m) => acc + m.quantidade, 0);

      const vendas = this.vendas
        .filter(v => v.produto_id === produto.id)
        .reduce((acc, v) => acc + v.quantidade, 0);

      const estoqueAtual = produto.quantidade + entradas - saidasMov - vendas;
      produto.estoqueAtual = estoqueAtual;

      return estoqueAtual < this.limiteMinimo;
    });
  }
}