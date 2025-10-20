import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracoesService } from '../configuracoes.service';


@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './loja.html',
  styleUrls: ['./loja.scss'],
})
export class LojaComponent {
  form: FormGroup;
  sucesso = false;
  erro = false;

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      nome_loja: ['', Validators.required],
      cnpj: ['', Validators.required],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required],
      logo: [null]
    });
  }

  salvar() {
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string | Blob);
    });

    this.configuracoesService.atualizarLoja(formData).subscribe({
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

  onLogoSelecionado(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ logo: file });
    }
  }
}