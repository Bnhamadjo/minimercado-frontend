import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-alerta-baixo-estoque',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './alerta-baixo.html',
  styleUrls: ['./alerta-baixo.scss'],
})
export class AlertaBaixoEstoqueComponent {
  private http = inject(HttpClient);
  produtos: any[] = [];

  ngOnInit(): void {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    this.http.get('http://localhost:8000/api/produtos/baixo-estoque', { headers }).subscribe((res: any) => {
      this.produtos = res;
    });
  }
}