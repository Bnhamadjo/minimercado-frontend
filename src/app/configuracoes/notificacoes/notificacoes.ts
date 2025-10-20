import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracoesService } from '../configuracoes.service';


@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './notificacoes.html',
  styleUrls: ['./notificacoes.scss'],
})
export class NotificacoesComponent {
  form: FormGroup;
  sucesso = false;
  erro = false;

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      alerta_vencimento: [true],
      alerta_estoque_baixo: [true],
      alerta_venda_alta: [false],
      canal_email: [true],
      canal_popup: [true],
      canal_sms: [false]
    });
  }

  salvar() {
    this.configuracoesService.atualizarNotificacoes(this.form.value).subscribe({
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