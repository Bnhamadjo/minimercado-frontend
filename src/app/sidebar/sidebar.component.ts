import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-sidebar',
    imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Produtos', route: '/produtos' },
    { label: 'Vendas', route: '/vendas' },
    { label: 'Estoque', route: '/estoque' },
    { label: 'Configurações', route: '/configuracoes' },
    { label: 'Fornecedores', route: '/fornecedores' },
    { label: 'Clientes', route: '/clientes' },
    { label: 'Relatórios', route: '/relatorios' },
    { label: 'Usuários', route: '/usuarios' },
    { label: 'Perfil', route: '/perfil' },
    { label: 'Sair', route: '/logout' },
    { label: 'Ajuda', route: '/ajuda' },
    { label: 'Sobre', route: '/sobre' },
    { label: 'Notificações', route: '/notificacoes' },
    { label: 'Configurações da Conta', route: '/configuracoes-conta' },
    { label: 'Preferências', route: '/preferencias' },
    { label: 'Suporte', route: '/suporte' },
    { label: 'Feedback', route: '/feedback' },

    
  ];

  
authService: AuthService;


  constructor(private router: Router, AuthService: AuthService) {
    this.authService = AuthService;
  }
  onLogout() {
  if (this.authService) {
    this.authService.logout();
    this.router.navigate(['/login']);
  } else {
    console.error('Serviço de autenticação não disponível.');
  }
}

}