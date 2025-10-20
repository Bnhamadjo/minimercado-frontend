import { ItemVenda } from "../item-venda.model";


export interface Venda {
  id?: number;
  valor_total?: number;
  forma_pagamento?: string;
  data_venda: string | Date;
  cliente_id?: number;
  itens?: ItemVenda[];
}