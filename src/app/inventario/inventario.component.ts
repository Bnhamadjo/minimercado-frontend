import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CurrencyPipe],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  dados: any = { valor_total_estoque: 0, valor_total_vendas: 0, lucro_estimado: 0 };
  produtos: any[] = [];
  produtosFiltrados: any[] = [];
  vendas: any[] = [];
  movimentacoes: any[] = [];

  filtroProduto = '';
  filtroCategoria = '';
  filtroFornecedor = '';

  @ViewChild('graficoLucro', { static: false }) graficoLucroRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoMensal', { static: false }) graficoMensalRef!: ElementRef<HTMLCanvasElement>;

  private apiUrl = 'http://localhost:8000/api/inventario';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carregar dados iniciais
    this.carregarMovimentacoes();
    this.carregarVendas();
    this.carregarInventario();
  }

  carregarMovimentacoes() {
    this.http.get<any[]>('http://localhost:8000/api/estoque/movimentacoes')
      .subscribe(res => this.movimentacoes = res);
  }

  carregarVendas() {
    this.http.get<any[]>('http://localhost:8000/api/vendas')
      .subscribe(res => this.vendas = res);
  }

  carregarInventario() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.dados = {
          valor_total_estoque: res.valor_total_estoque,
          valor_total_vendas: res.valor_total_vendas,
          lucro_estimado: res.lucro_estimado
        };

        this.produtos = res.produtos.map((p: { id: number; }) => ({
          ...p,
          quantidade: this.getEstoqueReal(p.id)
        }));

        this.produtosFiltrados = [...this.produtos];

        this.gerarGraficoLucro();
        this.gerarGraficoMensal(res.vendas);
      },
      error: (err) => console.error('Erro ao carregar inventário', err)
    });
  }

  getEstoqueReal(produtoId: number): number {
    const entradas = this.movimentacoes
      .filter(m => m.produto_id === produtoId && m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.quantidade, 0);

    const saidasMov = this.movimentacoes
      .filter(m => m.produto_id === produtoId && m.tipo === 'saida')
      .reduce((sum, m) => sum + m.quantidade, 0);

    const saidasVenda = this.vendas
      .filter(v => v.itens.some((i: any) => i.produto.id === produtoId))
      .reduce((sum, v) => {
        const item = v.itens.find((i: any) => i.produto.id === produtoId);
        return sum + (item?.quantidade || 0);
      }, 0);

    return entradas - saidasMov - saidasVenda;
  }

  aplicarFiltros() {
    this.produtosFiltrados = this.produtos.filter(p => {
      const nomeMatch = !this.filtroProduto || p.nome.toLowerCase().includes(this.filtroProduto.toLowerCase());
      const categoriaMatch = !this.filtroCategoria || (p.categoria?.nome || '').toLowerCase().includes(this.filtroCategoria.toLowerCase());
      const fornecedorMatch = !this.filtroFornecedor || (p.fornecedor?.nome || '').toLowerCase().includes(this.filtroFornecedor.toLowerCase());
      return nomeMatch && categoriaMatch && fornecedorMatch;
    });
  }

  limparFiltros() {
    this.filtroProduto = '';
    this.filtroCategoria = '';
    this.filtroFornecedor = '';
    this.produtosFiltrados = [...this.produtos];
  }

  imprimirTabela() {
    const printContents = document.getElementById('area-impressao')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  }

  gerarGraficoLucro() {
    if (!this.graficoLucroRef) return;

    new Chart(this.graficoLucroRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Lucro', 'Vendas', 'Estoque'],
        datasets: [{
          data: [
            this.dados.lucro_estimado,
            this.dados.valor_total_vendas,
            this.dados.valor_total_estoque
          ],
          backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  gerarGraficoMensal(vendas: any[]) {
    if (!this.graficoMensalRef) return;

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const vendasMensais = new Array(12).fill(0);

    vendas.forEach(v => {
      const mes = new Date(v.created_at).getMonth();
      const totalVenda = v.itens.reduce((sum: number, i: any) => sum + i.quantidade * i.preco, 0);
      vendasMensais[mes] += totalVenda;
    });

    new Chart(this.graficoMensalRef.nativeElement, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Vendas Mensais',
          data: vendasMensais,
          backgroundColor: '#2196f3'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
