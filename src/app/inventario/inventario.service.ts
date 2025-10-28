// src/app/services/inventario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, of, catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getInventario(): Observable<any> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    };

    const produtos$ = this.http
      .get<any[]>(`${this.baseUrl}/produtos`, { headers })
      .pipe(catchError(() => of([])));

    const vendas$ = this.http
      .get<any[]>(`${this.baseUrl}/vendas`, { headers })
      .pipe(catchError(() => of([])));

    return forkJoin([produtos$, vendas$]).pipe(
      map(([produtos, vendas]) => {
        // Soma o valor total dos produtos em estoque
        const valorEmEstoque = produtos.reduce(
          (acc, p) => acc + (p.preco ?? 0) * (p.quantidade ?? 0),
          0
        );

        // Soma o total das vendas (aceita valor_total ou total)
        const vendasTotais = vendas.reduce((acc, v) => {
          const valor =
            v.valor_total ??
            v.total ??
            (v.itens
              ? v.itens.reduce(
                  (sub: number, i: any) =>
                    sub + (i.preco_unitario ?? 0) * (i.quantidade ?? 0),
                  0
                )
              : 0);
          return acc + valor;
        }, 0);

        const lucroTotal = vendasTotais - valorEmEstoque;

        return {
          produtos,
          vendas,
          valorEmEstoque,
          vendasTotais,
          lucroTotal,
        };
      })
    );
  }
}
