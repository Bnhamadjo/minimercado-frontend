import { Component, OnInit } from '@angular/core';
import { ConfiguracoesService } from '../configuracoes/configuracoes.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  nomeLoja: string = 'Minimercado';
  logoPath: string = 'assets/logo.png';
  role: string = '';
  nomeUsuario: string = '';

  constructor(
    private configuracoesService: ConfiguracoesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pega role e nome do usuário do localStorage
    this.role = localStorage.getItem('role') || '';
    this.nomeUsuario = localStorage.getItem('name') || '';

    // Carrega configurações da loja
    this.configuracoesService.getConfiguracoesLoja().subscribe({
      next: (config) => {
        this.nomeLoja = config.nome_loja || this.nomeLoja;
        this.logoPath = config.logo || this.logoPath;
      },
      error: (err) => console.warn('Erro ao carregar configurações da loja:', err)
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
