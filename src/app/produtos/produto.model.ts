export interface Produto {
  id?: number;
  nome: string;
  codigo_barras?: string;
  preco: number;
  quantidade: number;
  categoria_id?: number;
  fornecedor_id?: number;
}