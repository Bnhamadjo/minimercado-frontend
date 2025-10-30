// Angular Core & Common
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// HTTP
import { HttpClient, HttpClientModule } from '@angular/common/http';

// ZXing Scanner
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// App Components & Services
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
    MatIconModule
  ],
  providers: [FornecedorService, FornecedorComponent],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss'],
})
export class CadastroComponent implements OnInit {
  private http = inject(HttpClient);

  produto: Produto = this.criarProdutoVazio();
  categorias: any[] = [];
  fornecedores: any[] = [];

  formats: BarcodeFormat[] = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_39,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E
  ];

  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;

  salvando = false; // 🔒 evita duplicação
  ultimoCodigoLido = ''; // 🔄 evita leitura repetida do mesmo código

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarFornecedores();
    this.inicializarScanner();
  }

  private inicializarScanner(): void {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.availableDevices = devices.filter(d => d.kind === 'videoinput');
      this.selectedDevice = this.availableDevices[0];
    });
  }

  onPermissionResponse(hasPermission: boolean): void {
    console.log('Permissão da câmera:', hasPermission);
    if (!hasPermission) {
      alert('⚠️ Acesso à câmera negado. Ative a permissão para o scanner funcionar.');
    }
  }

  // 🧠 Evita leitura repetida do mesmo QR
  onCodeResult(result: string): void {
    if (!result.trim() || result === this.ultimoCodigoLido) return;
    this.ultimoCodigoLido = result;

    console.log('QR detectado:', result);
    this.produto.codigo_barras = result;

    const headers = this.getHeaders();
    this.http.get(`http://localhost:8000/api/produtos?codigo_barras=${encodeURIComponent(result)}`, { headers })
      .subscribe({
        next: (res: any) => {
          if (res) {
            // Produto existente
            this.produto = {
              nome: res.nome || '',
              codigo_barras: res.codigo_barras || result,
              preco: res.preco || 0,
              quantidade: res.quantidade || 0,
              categoria_id: res.categoria_id || 0,
              fornecedor_id: res.fornecedor_id
            };
            alert(`⚠️ O produto "${res.nome}" já está cadastrado.`);
          }
        },
        error: () => console.log('Código novo — pode cadastrar.'),
      });
  }

  carregarCategorias(): void {
    const headers = this.getHeaders();
    this.http.get('http://localhost:8000/api/categorias', { headers })
      .subscribe({
        next: (res: any) => this.categorias = res,
        error: (err) => console.error('Erro ao carregar categorias', err)
      });
  }

  carregarFornecedores(): void {
    const headers = this.getHeaders();
    this.http.get('http://localhost:8000/api/fornecedores', { headers })
      .subscribe({
        next: (res: any) => this.fornecedores = res,
        error: (err) => console.error('Erro ao carregar fornecedores', err)
      });
  }

  salvarProduto(): void {
    if (this.salvando) return; // 🔒 bloqueio duplo

    const { nome, codigo_barras, preco, quantidade, categoria_id } = this.produto;
    if (!nome || !codigo_barras || !preco || !quantidade || !categoria_id) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    this.salvando = true;
    const headers = this.getHeaders();

    // 🧩 Primeiro verifica se já existe
    this.http.get(`http://localhost:8000/api/produtos?codigo_barras=${codigo_barras}`, { headers })
      .subscribe({
        next: (res: any) => {
          if (res) {
            alert('⚠️ Já existe um produto com este código de barras.');
            this.salvando = false;
          } else {
            // Cria novo produto
            this.http.post('http://localhost:8000/api/produtos', this.produto, { headers })
              .subscribe({
                next: () => {
                  alert('✅ Produto cadastrado com sucesso!');
                  this.resetarFormulario();
                  this.salvando = false;
                },
                error: (err) => {
                  console.error('Erro ao salvar produto', err);
                  alert('Erro ao salvar produto.');
                  this.salvando = false;
                }
              });
          }
        },
        error: (err) => {
          console.error('Erro ao verificar duplicidade', err);
          alert('Erro ao verificar duplicidade.');
          this.salvando = false;
        }
      });
  }

  private resetarFormulario(): void {
    this.produto = this.criarProdutoVazio();
    this.ultimoCodigoLido = '';
  }

  private criarProdutoVazio(): Produto {
    return {
      nome: '',
      codigo_barras: '',
      preco: 0,
      quantidade: 0,
      categoria_id: 0,
      fornecedor_id: undefined
    };
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }
}
