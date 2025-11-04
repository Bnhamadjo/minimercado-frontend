import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard';
import { ChartConfiguration } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  total_produtos: 0 | undefined
    total_vendas: 0 | undefined


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
    private http: HttpClient,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.loadStats();
   
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


 

navegarPara(destino: string) {
  switch (destino) {
    case 'produtos':
      this.router.navigate(['/produtos/listagem']);
      break;
    case 'vendas':
      this.router.navigate(['/vendas/listagem']);
      break;
    default:
      break;
  }
}


}