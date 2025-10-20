import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from './categoria.service';
import { HttpClientModule } from '@angular/common/http';
import { Categoria } from './categoria.model';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./categoria.component.scss'],
  templateUrl: './categoria.component.html'
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  categoria: Categoria = { nome: '' };
  mensagem: string = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  salvarCategoria(): void {
    this.categoria.id ? this.atualizarCategoria() : this.criarCategoria();
  }

  private criarCategoria(): void {
    this.categoriaService.criarCategoria(this.categoria).subscribe(() => {
      this.reiniciarFormulario('Categoria criada com sucesso!');
    });
  }

  private atualizarCategoria(): void {
    this.categoriaService.atualizarCategoria(this.categoria.id!, this.categoria).subscribe(() => {
      this.reiniciarFormulario('Categoria atualizada com sucesso!');
    });
  }

  editar(cat: Categoria): void {
    this.categoria = { ...cat };
  }

  deletar(id: number): void {
    this.categoriaService.deletarCategoria(id).subscribe(() => {
      this.carregarCategorias();
      this.mensagem = 'Categoria excluída com sucesso!';
      setTimeout(() => this.mensagem = '', 3000);
    });
  }

  private reiniciarFormulario(msg: string): void {
    this.carregarCategorias();
    this.categoria = { nome: '' };
    this.mensagem = msg;
    setTimeout(() => this.mensagem = '', 3000);
  }
}