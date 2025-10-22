import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VendaService } from '../../services/vendas.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-listagem-vendas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './listagem.html',
  styleUrls: ['./listagem.scss'],
})
export class ListagemVendasComponent {
  private http = inject(HttpClient);

  vendas: any[] = [];
  produtos: any[] = [];

   constructor(private vendaService: VendaService) {}

  ngOnInit(): void {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    this.vendaService.listar().subscribe((res: any) => {
      this.vendas = res;
    });

    this.http.get('http://localhost:8000/api/vendas', { headers }).subscribe((res: any) => {
      this.vendas = res;
    });

    this.http.get('http://localhost:8000/api/produtos', { headers }).subscribe((res: any) => {
      this.produtos = res;
    });
  }
}