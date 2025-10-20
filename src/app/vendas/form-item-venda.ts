import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemVenda } from './item-venda.model';
import { ProdutoService } from '../produtos/produto.service';
import { Produto } from '../produtos/produto.model';

@Component({
  selector: 'app-form-item-venda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-item-venda.html',
  styleUrls: ['./form-item-venda.scss'],
})
export class FormItemVendaComponent {
  


  @Output() itemAdicionado = new EventEmitter<ItemVenda>();

  item: ItemVenda = {
    produto_id: 0,
    quantidade: 1,
    preco_unitario: 0,
    subtotal: 0,
    produto: undefined
  };
 
  produtos: any[] = [];

  constructor(private produtoService: ProdutoService) {}

ngOnInit(): void {
  this.produtoService.getProdutos().subscribe((data: any[]) => {
    this.produtos = data;
  });
}


  adicionarItem() {
    this.item.subtotal = this.item.quantidade * this.item.preco_unitario;
    this.itemAdicionado.emit(this.item);
    this.item = { produto_id: 0, quantidade: 1, preco_unitario: 0, subtotal: 0 };
  }
}