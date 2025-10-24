import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VendaService } from '../../services/vendas.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listagem-vendas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './listagem.html',
  styleUrls: ['./listagem.scss'],
})
export class ListagemVendasComponent implements OnInit {
  private http = inject(HttpClient);
  private vendaService = inject(VendaService);

  vendas: any[] = [];
  vendasFiltradas: any[] = [];
  produtos: any[] = [];

  filtroInicio: string = '';
  filtroFim: string = '';
  filtroProduto: string = '';
  filtroMinTotal: number | null = null;
  filtroMaxTotal: number | null = null;

  today = new Date();

  ngOnInit(): void {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    };

    this.vendaService.listar().subscribe((vendas: any[]) => {
      this.vendas = vendas;
      this.vendasFiltradas = [...vendas];
    });

    this.http.get<any[]>('http://localhost:8000/api/produtos', { headers }).subscribe((produtos) => {
      this.produtos = produtos;
    });
  }

  abrirRegistro() {
  const largura = screen.width;
  const altura = screen.height;

  const novaJanela = window.open(
    '/vendas/registro',
    '_blank',
    `toolbar=no,scrollbars=no,resizable=no,top=0,left=0,width=${largura},height=${altura}`
  );

  novaJanela?.focus();
}

  aplicarFiltros(): void {
    this.vendasFiltradas = this.vendas.filter(v => {
      const dataVenda = new Date(v.data_venda);
      const inicioMatch = !this.filtroInicio || dataVenda >= new Date(this.filtroInicio);
      const fimMatch = !this.filtroFim || dataVenda <= new Date(this.filtroFim);
      const produtoMatch = !this.filtroProduto || v.itens.some((i: { produto: { nome: string } }) => i.produto?.nome === this.filtroProduto);
      const minMatch = this.filtroMinTotal == null || v.total >= this.filtroMinTotal;
      const maxMatch = this.filtroMaxTotal == null || v.total <= this.filtroMaxTotal;

      return inicioMatch && fimMatch && produtoMatch && minMatch && maxMatch;
    });
  }

  limparFiltros(): void {
    this.filtroInicio = '';
    this.filtroFim = '';
    this.filtroProduto = '';
    this.filtroMinTotal = null;
    this.filtroMaxTotal = null;
    this.vendasFiltradas = [...this.vendas];
  }

  verDetalhes() {
  console.log('Detalhes das vendas filtradas:', this.vendasFiltradas);
  // Aqui você pode abrir um modal, navegar para outra rota ou exibir mais dados
}

imprimirFiltrados() {
  const conteudo = document.getElementById('area-impressao');
  if (conteudo) {
    const janela = window.open('', '', 'width=800,height=600');
    janela?.document.write('<html><head><title>Impressão</title></head><body>');
    janela?.document.write(conteudo.innerHTML);
    janela?.document.write('</body></html>');
    janela?.document.close();
    janela?.print();
  }
}
}