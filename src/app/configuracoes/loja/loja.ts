import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfiguracoesService } from '../configuracoes.service';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [ 
ReactiveFormsModule,
CommonModule

  ],
  templateUrl: './loja.html',
  styleUrls: ['./loja.scss']
})
export class LojaComponent implements OnInit {
  form!: FormGroup;
  logoArquivo: File | null = null;
  sucesso = false;
  erro = false;

  constructor(
    private fb: FormBuilder,
    private configService: ConfiguracoesService
  ) {}

  ngOnInit(): void {
    // Inicializa o form
    this.form = this.fb.group({
      nome_loja: ['', Validators.required],
      cnpj: ['', Validators.required],
      endereco: [''],
      telefone: ['']
    });

    // Carrega os dados atuais da loja
    this.configService.getConfiguracoesLoja().subscribe(res => {
      this.form.patchValue({
        nome_loja: res.nome_loja,
        cnpj: res.cnpj,
        endereco: res.endereco,
        telefone: res.telefone
      });
    });
  }

  // Armazena arquivo selecionado
  onLogoSelecionado(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.logoArquivo = event.target.files[0];
    }
  }

  // Envia o FormData
  salvar() {
  this.sucesso = false;
  this.erro = false;

  // Validações simples do frontend
  if (!this.form.valid) {
    this.erro = true;
    console.error('Formulário inválido', this.form.errors);
    return;
  }

  const formData = new FormData();

  // Apenas envia campos que foram alterados
  const controles = this.form.controls;
  if (controles['nome_loja'].dirty) {
    formData.append('nome_loja', controles['nome_loja'].value);
  }
  if (controles['cnpj'].dirty) {
    formData.append('cnpj', controles['cnpj'].value);
  }
  if (controles['endereco'].dirty) {
    formData.append('endereco', controles['endereco'].value || '');
  }
  if (controles['telefone'].dirty) {
    formData.append('telefone', controles['telefone'].value || '');
  }

  // Logo
  if (this.logoArquivo) {
    formData.append('logo', this.logoArquivo, this.logoArquivo.name);
  }

  // Chamada ao serviço
  this.configService.atualizarLoja(formData).subscribe({
    next: (res: any) => {
      this.sucesso = true;
      console.log('Loja atualizada com sucesso:', res);
    },
    error: (err: any) => {
      this.erro = true;

      // Mostra mensagens detalhadas do backend
      if (err.error && err.error.errors) {
        Object.keys(err.error.errors).forEach(key => {
          console.error(`${key}: ${err.error.errors[key].join(', ')}`);
        });
      } else {
        console.error('Erro desconhecido ao atualizar loja', err);
      }
    }
  });
}

}