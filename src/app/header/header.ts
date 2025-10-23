import { Component, OnInit } from '@angular/core';
import { ConfiguracoesService } from '../configuracoes/configuracoes.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  imports: [CommonModule, HttpClientModule]
})
export class HeaderComponent implements OnInit {
  nomeLoja: string = 'Minimercado';
  logoPath: string = 'assets/logo.png';

  constructor(private configuracoesService: ConfiguracoesService) {}

  ngOnInit(): void {
    this.configuracoesService.getConfiguracoesLoja().subscribe({
      next: (config) => {
        this.nomeLoja = config.nome_loja || this.nomeLoja;
        this.logoPath = config.logo || this.logoPath; // ✅ usa 'logo' em vez de 'logo_url'
      },
      error: (err) => {
        console.warn('Erro ao carregar configurações da loja:', err);
      }
    });
  }
}