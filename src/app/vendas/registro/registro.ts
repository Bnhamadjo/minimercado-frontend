import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { ItemVenda } from '../item-venda.model';
import { FormItemVendaComponent } from '../form-item-venda';

@Component({
  selector: 'app-registro-venda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ZXingScannerModule,
     FormItemVendaComponent
  ],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class RegistroComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Scanner
  formats: BarcodeFormat[] = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;
  codigoCapturado = false;

  // Venda
  itens: any[] = [];
  total = 0;
  erro = '';

  constructor() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.availableDevices = devices.filter(d => d.kind === 'videoinput');
      this.selectedDevice = this.availableDevices[0];
    });
  }

  get headers() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }

  ngOnInit(): void {
  this.itens.push({
    produto_id: 1,
    nome: 'Produto Teste',
    quantidade: 1,
    preco_unitario: 1000,
    subtotal: 1000
  });
  this.calcularTotal();
}

  onCodeResult(codigo: string) {
    console.log('Código escaneado:', codigo);
    if (this.codigoCapturado) return;
    this.codigoCapturado = true;

    this.http.get(`http://localhost:8000/api/produtos?codigo_barras=${codigo}`, { headers: this.headers })
      .subscribe({
        next: (res: any) => {
          const produto = Array.isArray(res) ? res[0] : res;
          if (!produto) {
            this.erro = 'Produto não encontrado';
            return;
          }

          const existente = this.itens.find(i => i.produto_id === produto.id);
          if (existente) {
            existente.quantidade += 1;
            existente.subtotal = existente.quantidade * existente.preco_unitario;
          } else {
            this.itens.push({
              produto_id: produto.id,
              nome: produto.nome,
              quantidade: 1,
              preco_unitario: produto.preco,
              subtotal: produto.preco,
            });
          }

          this.calcularTotal();
          this.erro = '';
        },
        error: () => {
          this.erro = 'Erro ao buscar produto';
        }
      });

    setTimeout(() => this.codigoCapturado = false, 3000);
  }

  inserirItem(item: ItemVenda) {
  this.itens.push(item);
  this.calcularTotal();
}
  calcularTotal() {
    this.total = this.itens.reduce((sum, item) => sum + item.subtotal, 0);
  }

  registrarVenda() {
    const payload = {
      valor_total: this.total,
      itens: this.itens.map(i => ({
        produto_id: i.produto_id,
        quantidade: i.quantidade,
        preco_unitario: i.preco_unitario,
      })),
    };

    this.http.post('http://localhost:8000/api/vendas', payload, { headers: this.headers })
      .subscribe({
        next: (res: any) => {
          alert('Venda registrada com sucesso!');
          if (res && res.id) {
            this.router.navigate(['/vendas/recibo', res.id]);
          } else {
            this.router.navigate(['/vendas']);
          }
          this.itens = [];
          this.total = 0;
        },
        error: () => {
          this.erro = 'Erro ao registrar venda';
        }
      });
  }
}