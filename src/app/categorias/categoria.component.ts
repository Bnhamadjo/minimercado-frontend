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

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.getCategorias().subscribe(data => this.categorias = data);
  }

  salvarCategoria(): void {
    if (this.categoria.id) {
      this.categoriaService.atualizarCategoria(this.categoria.id, this.categoria).subscribe(() => {
        this.carregarCategorias();
        this.categoria = { nome: '' };
      });
    } else {
      this.categoriaService.criarCategoria(this.categoria).subscribe(() => {
        this.carregarCategorias();
        this.categoria = { nome: '' };
      });
    }
  }

  editar(cat: Categoria): void {
    this.categoria = { ...cat };
  }

  deletar(id: number): void {
    this.categoriaService.deletarCategoria(id).subscribe(() => this.carregarCategorias());
  }
}