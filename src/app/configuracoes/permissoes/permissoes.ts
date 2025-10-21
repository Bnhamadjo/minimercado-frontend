import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracoesService } from '../configuracoes.service';

@Component({
  selector: 'app-permissoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './permissoes.html',
  styleUrls: ['./permissoes.scss'],
})
export class PermissoesComponent {
  form: FormGroup;
  sucesso = false;
  erro = false;
  carregando = false;

  permissoesDisponiveis = ['visualizar', 'editar', 'excluir', 'exportar'];

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      perfil: ['operador'],
      permissoes: this.fb.array(this.permissoesDisponiveis.map(() => this.fb.control(false)))
    });

    // Carrega permissões ao trocar o perfil
    this.form.get('perfil')?.valueChanges.subscribe(perfil => {
      this.configuracoesService.getPermissoesPorPerfil(perfil).subscribe({
        next: (res) => {
          const permissoesArray = this.form.get('permissoes') as FormArray;
          permissoesArray.controls.forEach((control, index) => {
            const nomePermissao = this.permissoesDisponiveis[index];
            control.setValue(res.permissoes.includes(nomePermissao));
          });
        },
        error: () => {
          console.error('Erro ao carregar permissões');
          this.form.get('permissoes')?.reset();
        }
      });
    });

    // Dispara carregamento inicial
    const perfilInicial = this.form.get('perfil')?.value;
    if (perfilInicial) {
      this.form.get('perfil')?.setValue(perfilInicial);
    }
  }

  salvar() {
    this.carregando = true;
    this.sucesso = false;
    this.erro = false;

    const permissoesSelecionadas = this.form.value.permissoes
      .map((v: boolean, i: number) => v ? this.permissoesDisponiveis[i] : null)
      .filter((v: string | null) => v !== null);

    const payload = {
      perfil: this.form.value.perfil,
      permissoes: permissoesSelecionadas
    };

    this.configuracoesService.atualizarPermissoes(payload).subscribe({
      next: () => {
        this.sucesso = true;
        this.erro = false;
        this.carregando = false;
      },
      error: () => {
        this.sucesso = false;
        this.erro = true;
        this.carregando = false;
      }
    });
  }
}