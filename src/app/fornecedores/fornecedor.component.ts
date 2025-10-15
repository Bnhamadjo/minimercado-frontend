import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FornecedorService } from './fornecedor.service';
import { Fornecedor } from './fornecedor.model';

@Component({
  selector: 'app-fornecedor',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './fornecedor.component.html',
  styleUrls:   ['./fornecedor.component.scss']
})
export class FornecedorComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  fornecedor: Fornecedor = { nome: '' };

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores().subscribe(data => this.fornecedores = data);
  }

  salvarFornecedor(): void {
    if (this.fornecedor.id) {
      this.fornecedorService.atualizarFornecedor(this.fornecedor.id, this.fornecedor).subscribe(() => {
        this.carregarFornecedores();
        this.fornecedor = { nome: '' };
      });
    } else {
      this.fornecedorService.criarFornecedor(this.fornecedor).subscribe(() => {
        this.carregarFornecedores();
        this.fornecedor = { nome: '' };
      });
    }
  }

  editar(f: Fornecedor): void {
    this.fornecedor = { ...f };
  }

  deletar(id: number): void {
    this.fornecedorService.deletarFornecedor(id).subscribe(() => this.carregarFornecedores());
  }
}