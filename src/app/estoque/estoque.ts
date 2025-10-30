import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertaBaixoEstoqueComponent } from './alerta-baixo/alerta-baixo';
import { MovimentacoesEstoqueComponent } from './movimentacoes/movimentacoes';
import { ConfiguracoesService } from '../configuracoes/configuracoes.service';


@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, MovimentacoesEstoqueComponent, AlertaBaixoEstoqueComponent],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.scss']
})
export class EstoqueComponent {
  movimentacoesAtualizadas = false;
  alertasAtualizados = false;
   alertaMinimo = 10;


  @ViewChild(AlertaBaixoEstoqueComponent)
  alertaComponent!: AlertaBaixoEstoqueComponent;

  constructor(private configuracoesService: ConfiguracoesService) {}

  ngOnInit() {
    this.configuracoesService.obterConfiguracoesEstoque().subscribe(config => {
      this.alertaMinimo = config.alerta_minimo;
    });
  }


  onMovimentacaoRegistrada() {
    this.movimentacoesAtualizadas = true;
    console.log('Movimentação registrada. Atualizando alertas...');
    if (this.alertaComponent) {
      this.alertaComponent.verificarEstoque(); // 🔁 atualiza alertas automaticamente
    }
  }

  

  onAlertaAtualizado() {
    this.alertasAtualizados = true;
    console.log('Alertas de estoque atualizados.');
  }
}