import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemVenda } from './item-venda.model';
import { ProdutoService } from '../produtos/produto.service';
import { Produto } from '../produtos/produto.model';
import { ConfiguracoesService } from '../configuracoes/configuracoes.service';

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
    produto: undefined,
    parcelas: '1x',
  };
 
  produtos: any[] = [];
  metodosPermitidos: string[] = [];
  permiteParcelamento: boolean = false;

  constructor(private produtoService: ProdutoService, private configuracoesService: ConfiguracoesService
) {}

ngOnInit(): void {
  this.produtoService.getProdutos().subscribe((data: any[]) => {
    this.produtos = data;
  });

  this.configuracoesService.getConfiguracoes().subscribe((config: { pagamento: { metodos: string[]; parcelamento: boolean; }; }) => {
    this.metodosPermitidos = config.pagamento.metodos;
    this.permiteParcelamento = config.pagamento.parcelamento;
  });

}

adicionarItem() {
  if (this.item.preco_unitario <= 0) {
    alert('O preço unitário deve ser maior que zero.');
    return;
  }

  this.item.subtotal = this.item.quantidade * this.item.preco_unitario;
  this.itemAdicionado.emit(this.item);

  // Resetar o formulário
  this.item = {
    produto_id: 0,
    quantidade: 1,
    preco_unitario: 0,
    parcelas: '1x',
    subtotal: 0,
  };
}
}