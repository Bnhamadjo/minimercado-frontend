export interface Movimentacao {
  id?: number;
  produto_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data_movimento: string;
  data_validade?: string; // <-- Novo campo opcional
  observacao?: string;
}
