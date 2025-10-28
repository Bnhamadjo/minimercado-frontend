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

  filtroProduto = '';
  filtroCategoria = '';
  filtroFornecedor = '';

  @ViewChild('graficoLucro', { static: false }) graficoLucroRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoMensal', { static: false }) graficoMensalRef!: ElementRef<HTMLCanvasElement>;

  private apiUrl = 'http://localhost:8000/api/inventario';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarInventario();
  }

  carregarInventario() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.dados = {
          valor_total_estoque: res.valor_total_estoque,
          valor_total_vendas: res.valor_total_vendas,
          lucro_estimado: res.lucro_estimado
        };
        this.produtos = res.produtos;
        this.produtosFiltrados = [...this.produtos];
        this.gerarGraficoLucro();
        this.gerarGraficoMensal(res.vendas);
      },
      error: (err) => console.error('Erro ao carregar inventário', err)
    });
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
    const conteudo = document.getElementById('area-impressao');
    if (conteudo) {
      const janela = window.open('', '', 'width=900,height=600');
      janela?.document.write('<html><head><title>Impressão</title></head><body>');
      janela?.document.write(conteudo.innerHTML);
      janela?.document.write('</body></html>');
      janela?.document.close();
      janela?.print();
    }
  }

  gerarGraficoLucro() {
    if (!this.graficoLucroRef) return;
    const topProdutos = [...this.produtos].sort((a,b)=> (b.lucro_total||0) - (a.lucro_total||0)).slice(0,5);
    const nomes = topProdutos.map(p=>p.nome);
    const lucros = topProdutos.map(p=>p.lucro_total||0);

    new Chart(this.graficoLucroRef.nativeElement, {
      type: 'bar',
      data: { labels: nomes, datasets: [{ label:'Lucro por Produto', data:lucros, backgroundColor:'rgba(46,204,113,0.7)', borderColor:'#27ae60', borderWidth:1 }] },
      options: { responsive:true, plugins:{ title:{display:true,text:'Top 5 Produtos Mais Lucrativos'}, legend:{display:false} }, scales:{y:{beginAtZero:true,title:{display:true,text:'Lucro (FCFA)'}}, x:{title:{display:true,text:'Produto'}} } }
    });
  }

  gerarGraficoMensal(vendas: any[]) {
    if (!this.graficoMensalRef) return;
    const dadosMensais = new Map<string,{ totalVendas:number; totalLucro:number }>();
    vendas.forEach(v=>{
      const dataVenda = new Date(v.data_venda);
      const mes = dataVenda.toLocaleString('default',{month:'short',year:'numeric'});
      const valorVenda = v.valor_total || 0;
      const lucro = v.itens?.reduce((s:any,i:any)=> s + ((i.preco_unitario - (i.produto?.preco||0)) * i.quantidade),0) || 0;
      if(!dadosMensais.has(mes)) dadosMensais.set(mes,{totalVendas:0,totalLucro:0});
      const registro = dadosMensais.get(mes)!;
      registro.totalVendas += valorVenda;
      registro.totalLucro += lucro;
    });
    const labels = Array.from(dadosMensais.keys());
    const vendasData = Array.from(dadosMensais.values()).map(v=>v.totalVendas);
    const lucroData = Array.from(dadosMensais.values()).map(v=>v.totalLucro);

    new Chart(this.graficoMensalRef.nativeElement, {
      type:'line',
      data:{ labels, datasets:[
        { label:'Vendas (FCFA)', data:vendasData, borderColor:'#3498db', backgroundColor:'rgba(52,152,219,0.3)', fill:true, tension:0.4 },
        { label:'Lucro (FCFA)', data:lucroData, borderColor:'#2ecc71', backgroundColor:'rgba(46,204,113,0.3)', fill:true, tension:0.4 }
      ] },
      options:{ responsive:true, plugins:{title:{display:true,text:'Evolução Mensal: Vendas x Lucro'}, legend:{position:'bottom'}}, scales:{y:{beginAtZero:true}, x:{title:{display:true,text:'Mês'}}} }
    });
  }

}
