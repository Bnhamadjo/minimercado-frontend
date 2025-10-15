import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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
    { label: 'Configurações', route: '/configuracoes' }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}