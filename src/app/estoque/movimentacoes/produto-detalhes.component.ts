import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-produto-detalhes',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.produto.nome }} - Detalhes</h2>

    <div mat-dialog-content class="detalhes-container">
      <p><strong>Estoque atual:</strong> {{ data.estoque }}</p>
      <p><strong>Total vendido:</strong> {{ data.totalVendido }}</p>

      <h3>📦 Movimentações</h3>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let m of data.movimentacoes">
            <td>{{ m.created_at | date:'short' }}</td>
            <td>{{ m.tipo }}</td>
            <td>{{ m.quantidade }}</td>
            <td>{{ m.motivo }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button color="warn" (click)="fechar()">Fechar</button>
    </div>
  `,
  styles: [`
    .detalhes-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  font-size: 15px;
  padding: 1rem;
  color: #333;

  h3 {
    margin-top: 1rem;
    color: #005c99;
    font-size: 1.1rem;
    border-bottom: 2px solid #005c99;
    padding-bottom: 0.4rem;
  }
}

.tabela-movimentacoes {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;

  th, td {
    border: 1px solid #ddd;
    padding: 6px 8px;
    text-align: center;
  }

  th {
    background-color: #f4f6f8;
    color: #333;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
}

button[mat-button] {
  background-color: #d9534f;
  color: white;
  border-radius: 6px;
  padding: 6px 14px;
  transition: 0.3s ease;
  &:hover {
    background-color: #c9302c;
  }
}

  `]
})
export class ProdutoDetalhesComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProdutoDetalhesComponent>
  ) {}

  fechar() {
    this.dialogRef.close();
  }
}
