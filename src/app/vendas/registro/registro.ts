import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormItemVendaComponent } from '../form-item-venda';
import { MatIconModule } from '@angular/material/icon';

export interface ItemVenda {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  parcelas?: string;
  produto?: { nome: string };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ZXingScannerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    FormItemVendaComponent,
    MatIconModule
  ],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss']
})
export class RegistroComponent implements OnInit {
  private http = inject(HttpClient);

  selectedDevice?: MediaDeviceInfo;
  availableDevices: MediaDeviceInfo[] = [];
  formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];

  itens: ItemVenda[] = [];
  erro: string = '';
  total: number = 0;

  formaPagamento: string = 'À vista';

  ngOnInit(): void {
    this.carregarCameras();
  }

  carregarCameras() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.availableDevices = devices.filter(d => d.kind === 'videoinput');
      if (this.availableDevices.length) this.selectedDevice = this.availableDevices[0];
    });
  }

  onCodeResult(result: string) {
    if (!result) return;

    this.http.get(`http://localhost:8000/api/produtos?codigo_barras=${encodeURIComponent(result)}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res && res.id) {
          const itemExistente = this.itens.find(i => i.produto_id === res.id);
          if (itemExistente) {
            itemExistente.quantidade += 1;
          } else {
            if (res.preco <= 0) {
              this.erro = 'Produto com preço inválido.';
              return;
            }

            this.itens.push({
              produto_id: res.id,
              quantidade: 1,
              preco_unitario: res.preco,
              produto: { nome: res.nome }
            });
          }
          this.calcularTotal();
        } else {
          this.erro = 'Produto não encontrado.';
        }
      },
      error: () => this.erro = 'Erro ao buscar produto.'
    });
  }

  inserirItem(item: ItemVenda) {
    if (item.preco_unitario <= 0) {
      this.erro = 'Preço unitário inválido.';
      return;
    }


    this.itens.push(item);
    this.calcularTotal();
  }

  removerItem(item: ItemVenda) {
  this.itens = this.itens.filter(i => i !== item);
  this.calcularTotal();
}

  calcularTotal() {
    this.total = this.itens.reduce((sum, item) => sum + item.quantidade * item.preco_unitario, 0);
  }

  registrarVenda() {
    if (!this.itens.length) {
      this.erro = 'Adicione pelo menos um item.';
      return;
    }

    const venda = {
      valor_total: this.total,
      forma_pagamento: 'À vista',
      data_venda: new Date().toISOString(),
      itens: this.itens.map(i => ({
        produto_id: i.produto_id,
        quantidade: i.quantidade,
        preco_unitario: i.preco_unitario,
        parcelas: i.parcelas || '1x'
      }))
    };

    this.http.post('http://localhost:8000/api/vendas', venda, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          alert('Venda registrada com sucesso!');
          this.limparRegistro();
        },
        error: (err) => {
          console.error('Erro ao registrar venda', err);
          this.erro = 'Erro ao registrar venda.';
        }
      });
  }

  limparRegistro() {
    this.itens = [];
    this.total = 0;
    this.erro = '';
  }

  fechar() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  private getHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }
}