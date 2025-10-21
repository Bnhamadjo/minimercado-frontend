import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracoesService } from '../configuracoes.service';


@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './pagamento.html',
  styleUrls: ['./pagamento.scss'],
})
export class PagamentoComponent {
  form: FormGroup;
  sucesso = false;
  erro = false;

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      dinheiro: [true],
      cartao: [true],
      pix: [true],
      vale: [false],
      taxa_cartao: [''],
      desconto_pix: [''],
      parcelamento: [false],
    });
  }

  salvar() {
    this.configuracoesService.atualizarPagamento(this.form.value).subscribe({
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