import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recibo-venda',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './recibo.html',
  styleUrls: ['./recibo.scss'],
})
export class ReciboComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  venda: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.get(`http://localhost:8000/api/vendas/${id}`, { headers }).subscribe((res: any) => {
      this.venda = res;
    });
  }

  imprimir() {
    window.print();
  }
}