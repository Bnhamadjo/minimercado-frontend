import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grafico-vendas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, HttpClientModule],
  template: `
    <div class="grafico-container" *ngIf="chartData">
  <canvas baseChart
    [data]="chartData"
    [type]="chartType"
    [options]="chartOptions">
  </canvas>

    </div>
  `
})
export class GraficoVendasComponent {
  chartData: ChartConfiguration<ChartType>['data'] | null = null;
  chartType: ChartType = 'line';
  chartOptions: ChartConfiguration<ChartType>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Vendas por Dia' }
    }
  };

  constructor(private http: HttpClient) {
    this.http.get<any>('/assets/grafico_vendas_por_dia.json').subscribe(data => {
      this.chartData = {
        labels: data.labels,
        datasets: data.datasets
      };
    });
  }
}