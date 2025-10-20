import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracoesService } from '../configuracoes.service';


@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.scss'],
})
export class EstoqueComponent {
  form: FormGroup;
  sucesso = false;
  erro = false;

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      unidade_padrao: ['unidade', Validators.required],
      alerta_minimo: [10, Validators.required],
      validade_ativa: [true],
      dias_validade_alerta: [5]
    });
  }

  salvar() {
    this.configuracoesService.atualizarEstoque(this.form.value).subscribe({
      next: () => {
        this.sucesso = true;
        this.erro = false;
      },
      error: () => {
        this.sucesso = false;
        this.erro = true;
      }
    });
  }
}