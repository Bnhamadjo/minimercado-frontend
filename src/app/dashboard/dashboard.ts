import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard';
import { ChartConfiguration } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  chartData: ChartConfiguration<'line'>['data'] | null = null;
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Vendas por Dia' }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadChartData();
  }

  private loadStats(): void {
    const svc: any = this.dashboardService as any;
    if (svc && typeof svc.getStats === 'function') {
      svc.getStats().subscribe(
        (res: any) => { this.stats = res; },
        (err: any) => { console.error('Failed to load stats', err); this.stats = {}; }
      );
    } else {
      this.stats = {};
    }
  }

  private loadChartData(): void {
    this.http.get<any>('http://localhost:8000/api/grafico-vendas').subscribe(
      data => {
        this.chartData = {
          labels: data.labels,
          datasets: data.datasets
        };
      },
      err => {
        console.error('Erro ao carregar gráfico de vendas', err);
        this.chartData = null;
      }
    );
  }
}