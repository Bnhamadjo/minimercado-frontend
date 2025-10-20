import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracoesService } from '../configuracoes.service';


@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './relatorios.html',
  styleUrls: ['./relatorios.scss'],
})
export class RelatoriosComponent {
  form: FormGroup;
  sucesso = false;
  erro = false;

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      frequencia: ['diario', Validators.required],
      formato: ['pdf', Validators.required],
      filtro_padrao: ['data'],
      envio_email: [false],
      email_destino: ['']
    });
  }

  salvar() {
    this.configuracoesService.atualizarRelatorios(this.form.value).subscribe({
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