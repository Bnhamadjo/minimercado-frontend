import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfiguracoesService } from '../configuracoes.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-configuracoes-loja',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loja.html',
  styleUrls: ['./loja.scss']
})
export class LojaComponent implements OnInit {
  form!: FormGroup;
  logoFile!: File;
  sucesso = false;
  erro = false;

  constructor(
    private fb: FormBuilder,
    private configuracoesService: ConfiguracoesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome_loja: [''],
      cnpj: [''],
      endereco: [''],
      telefone: ['']
    });

    this.configuracoesService.getConfiguracoesLoja().subscribe(config => {
      this.form.patchValue(config);
    });
  }

  onLogoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logoFile = input.files[0];
    }
  }

  salvar(): void {
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }

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
}