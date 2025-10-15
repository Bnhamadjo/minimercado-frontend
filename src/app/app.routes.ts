import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth-guard';
import { LayoutComponent } from './layout/layout.component';

import { DashboardComponent } from './dashboard/dashboard';
import { CadastroComponent } from './produtos/cadastro/cadastro';
import { ListagemComponent } from './produtos/listagem/listagem';
import { RegistroComponent } from './vendas/registro/registro';
import { ListagemVendasComponent } from './vendas/listagem/listagem';
import { ReciboComponent } from './vendas/recibo/recibo';
import { AlertaBaixoEstoqueComponent } from './estoque/alerta-baixo/alerta-baixo';
import { MovimentacoesEstoqueComponent } from './estoque/movimentacoes/movimentacoes';
import { FornecedorComponent } from './fornecedores/fornecedor.component';
import { CategoriaComponent } from './categorias/categoria.component';
import { ListagemItensComponent } from './vendas/listagem-itens';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produtos/cadastro', component: CadastroComponent },
      { path: 'produtos/listagem', component: ListagemComponent },
      { path: 'vendas/registro', component: RegistroComponent },
      { path: 'vendas/listagem', component: ListagemVendasComponent },
      { path: 'vendas/recibo/:id', component: ReciboComponent },
      { path: 'estoque/alerta', component: AlertaBaixoEstoqueComponent },
      { path: 'estoque/movimentacoes', component: MovimentacoesEstoqueComponent },
      { path: 'categorias', component: CategoriaComponent },
      { path: 'fornecedores', component: FornecedorComponent },
      { path: 'vendas/itens', component: ListagemItensComponent },


    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}