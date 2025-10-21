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
  carregando = false;

  roles: string[] = ['admin', 'user'];

  constructor(private fb: FormBuilder, private configuracoesService: ConfiguracoesService) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.minLength(6)], // ← aqui está o ajuste
      role: ['', Validators.required] // Adiciona validação obrigatória
    });
  }

  ngOnInit(): void {
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
      this.carregando = true;
      this.sucesso = false;
      this.erro = false;

      const payload = {
        nome: this.form.value.nome,
        email: this.form.value.email,
        senha: this.form.value.senha || undefined, // evita enviar string vazia
        role: this.form.value.role
      };

      this.configuracoesService.updatePerfil(payload).subscribe({
        next: () => {
          this.sucesso = true;
          this.carregando = false;
        },
        error: (err) => {
          console.error('Erro ao atualizar perfil', err);
          this.erro = true;
          this.carregando = false;
        }
      });
    } else {
      this.erro = true;
    }
  }
}