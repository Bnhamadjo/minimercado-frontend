import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FornecedorComponent } from '../../fornecedores/fornecedor.component';
import { FornecedorService } from '../../fornecedores/fornecedor.service';


interface Produto {
  nome: string;
  codigo_barras: string;
  preco: number;
  quantidade: number;
  categoria_id: number;
  fornecedor_id?: number;

}

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
imports: [
  CommonModule,
  FormsModule,
  HttpClientModule,
  ZXingScannerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatIconModule,
  
 
],
providers: [FornecedorService],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss'],
})
export class CadastroComponent implements OnInit {
  private http = inject(HttpClient);

  produto: Produto = {
    nome: '',
    codigo_barras: '',
    preco: 0,
    quantidade: 0,
    categoria_id: 0,
    fornecedor_id: undefined
  };

  categorias: any[] = [];
  fornecedores: any[] = [];
  formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;


  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarFornecedores();
    navigator.mediaDevices.enumerateDevices().then(devices => {
    this.availableDevices = devices.filter(d => d.kind === 'videoinput');
    this.selectedDevice = this.availableDevices[0]; // Seleciona a primeira câmera disponível
  })

  
    
  }
onCodeResult(result: string): void {
  console.log('QR detectado:', result); // Ajuda a depurar
  this.produto.codigo_barras = result;

  const headers = this.getHeaders();

  // Busca o produto apenas se o resultado do QR não estiver vazio
  if (result && result.trim() !== '') {
    this.http.get(`http://localhost:8000/api/produtos?codigo_barras=${encodeURIComponent(result)}`, { headers })
      .subscribe({
        next: (res: any) => {
          if (res) {
            // Atualiza apenas os campos recebidos da API
            this.produto.nome = res.nome || '';
            this.produto.preco = res.preco || 0;
            this.produto.quantidade = res.quantidade || 0;
            this.produto.categoria_id = res.categoria_id || 0;
            this.produto.fornecedor_id = res.fornecedor_id;
          }
        },
        error: (err) => {
          console.error('Produto não encontrado', err);
        }
      });
  }
}


  carregarCategorias(): void {
    const headers = this.getHeaders();
    this.http.get('http://localhost:8000/api/categorias', { headers }).subscribe({
      next: (res: any) => this.categorias = res,
      error: (err) => console.error('Erro ao carregar categorias', err)
    });
  }

  carregarFornecedores(): void {
    const headers = this.getHeaders();
    this.http.get('http://localhost:8000/api/fornecedores', { headers }).subscribe({
      next: (res: any) => this.fornecedores = res,
      error: (err) => console.error('Erro ao carregar fornecedores', err)
    });
  }

 

  verificarDuplicidade(): void {
  const headers = this.getHeaders();
  this.http.get(`http://localhost:8000/api/produtos?codigo_barras=${this.produto.codigo_barras}`, { headers })
    .subscribe({
      next: (res: any) => {
        if (res) {
          alert('Já existe um produto com este código de barras.');
        } else {
          this.salvarProduto();
        }
      },
      error: () => {
        alert('Erro ao verificar duplicidade.');
      }
    });
}

  salvarProduto(): void {
    if (!this.produto.nome || !this.produto.codigo_barras || !this.produto.preco || !this.produto.quantidade || !this.produto.categoria_id) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    

    const headers = this.getHeaders();
    this.http.post('http://localhost:8000/api/produtos', this.produto, { headers }).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.produto = {
          nome: '',
          codigo_barras: '',
          preco: 0,
          quantidade: 0,
          categoria_id: 0,
          fornecedor_id: undefined
        };
      },

      
      error: (err) => {
        console.error('Erro ao salvar produto', err);
        alert('Erro ao salvar produto.');
      }
    });
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }
}