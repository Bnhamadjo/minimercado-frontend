import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ConfiguracoesService } from '../configuracoes.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  sucesso = false;
  erro = false;

  roles: string[] = ['admin', 'user'];

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
      role: [''] // Inclui o campo role para enviar ao backend
    });
  }

  ngOnInit(): void {
    // Carrega os dados do usuário logado
    this.configuracoesService.getPerfil().subscribe({
      next: (user: any) => {
        this.form.patchValue({
          nome: user.nome,
          email: user.email,
          role: user.role
        });
      },
      error: (err) => {
        console.error('Erro ao carregar perfil', err);
        this.erro = true;
      }
    });
  }

  salvar(): void {
    if (this.form.valid) {
      this.configuracoesService.updatePerfil(this.form.value).subscribe({
        next: () => {
          this.sucesso = true;
          this.erro = false;
        },
        error: (err) => {
          console.error('Erro ao atualizar perfil', err);
          this.sucesso = false;
          this.erro = true;
        }
      });
    } else {
      this.erro = true;
    }
  }
}
