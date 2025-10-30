import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-recibo-venda',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatDialogModule],
  templateUrl: './recibo.html',
  styleUrls: ['./recibo.scss'],
})
export class ReciboComponent {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  venda: any;

  // ✅ Recebe os dados passados pelo dialog (ex: { id: 123 })
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }) {}

  ngOnInit(): void {
    if (!this.data?.id) return;

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.get(`http://localhost:8000/api/vendas/${this.data.id}`, { headers })
      .subscribe((res: any) => {
        this.venda = res;
        this.cdr.detectChanges();
      });
  }

  get totalVenda(): number {
    if (!this.venda || !this.venda.itens) return 0;

    return this.venda.itens.reduce((total: number, item: any) => {
      const subtotal = Number(item.subtotal) || (Number(item.quantidade) * Number(item.preco_unitario));
      return total + subtotal;
    }, 0);
  }

  imprimir() {
    window.print();
  }
}
