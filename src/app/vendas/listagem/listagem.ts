import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listagem-vendas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './listagem.html',
  styleUrls: ['./listagem.scss'],
})
export class ListagemVendasComponent {
  private http = inject(HttpClient);

  vendas: any[] = [];

  ngOnInit(): void {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    this.http.get('http://localhost:8000/api/vendas', { headers }).subscribe((res: any) => {
      this.vendas = res;
    });
  }
}