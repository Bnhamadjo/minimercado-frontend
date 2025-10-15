import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemVendaService } from '../services/item-venda.service';
import { ItemVenda } from './item-venda.model';

@Component({
  selector: 'app-listagem-itens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listagem-itens.html',
  styleUrls: ['./listagem-itens.scss'],
})
export class ListagemItensComponent implements OnInit {
  itens: ItemVenda[] = [];

  constructor(private itemService: ItemVendaService) {}

  ngOnInit(): void {
    this.itemService.listar().subscribe(data => this.itens = data);
  }

  remover(id?: number) {
    if (!id) return;
    this.itemService.remover(id).subscribe(() => {
      this.itens = this.itens.filter(i => i.id !== id);
    });
  }
}