import { Produto } from "../produtos/produto.model";

export interface ItemVenda {
  id?: number;
  venda_id?: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  subtotal?: number;
  produto?: Produto;
}