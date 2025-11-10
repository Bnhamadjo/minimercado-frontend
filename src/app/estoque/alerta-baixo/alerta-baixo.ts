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
  @Input() diasAlertaValidade: number = 7; // alerta validade próxima
  @Output() alertaAtualizado = new EventEmitter<void>();

  produtos: any[] = [];
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
      this.calcularEstoqueAtual();
      this.alertaAtualizado.emit();
    });
  }

  calcularEstoqueAtual(): void {
    this.produtosBaixoEstoque = this.produtos.filter(produto => {
      const estoqueAtual = Number(produto.quantidade ?? 0);
      produto.estoqueAtual = estoqueAtual;

      // alerta validade próxima
      let avisoValidade = false;
      if (produto.data_validade && Number(this.diasAlertaValidade) > 0) {
        const validade = new Date(produto.data_validade);
        const diffDias = Math.ceil((validade.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        avisoValidade = diffDias <= Number(this.diasAlertaValidade);
      }

      return estoqueAtual <= Number(this.limiteMinimo) || avisoValidade;
    });
  }

  getAlertaTipo(produto: any): string {
    const estoqueAtual = Number(produto.estoqueAtual ?? 0);

    if (estoqueAtual <= Number(this.limiteMinimo)) {
      return '⚠️ Estoque baixo';
    }

    if (produto.data_validade && Number(this.diasAlertaValidade) > 0) {
      const validade = new Date(produto.data_validade);
      const diffDias = Math.ceil((validade.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (diffDias <= Number(this.diasAlertaValidade)) {
        return `⚠️ Vence em ${diffDias} dias`;
      }
    }

    return '';
  }
}
