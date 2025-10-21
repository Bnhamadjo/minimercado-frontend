import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PermissaoResponse {
  perfil: string;
  permissoes: string[];
}

@Injectable({ providedIn: 'root' })
export class ConfiguracoesService {
  erro!: boolean;
  carregando: boolean | undefined;
 getConfiguracoes(): Observable<any> {
  return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
}
  private apiUrl = 'http://localhost:8000/api/configuracoes';

  constructor(private http: HttpClient) {}

  // Atualiza o perfil do usuário
  updatePerfil(data: any): Observable<any> {
  const payload = { ...data };
  if (!payload.senha) delete payload.senha;
  return this.http.put(`${this.apiUrl}/perfil`, payload, { headers: this.getHeaders() });

  error: (err: { error: any; }) => {
  console.error('Erro ao atualizar perfil', err);
  console.error('Detalhes do servidor:', err.error); // ← isso mostra a mensagem de validação
  this.erro = true;
  this.carregando = false;
}
}

  // Obtém o perfil do usuário logado
  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil`, { headers: this.getHeaders() });
  }

  // Atualiza as configurações da loja
  atualizarLoja(data: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/loja`, data, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      // ✅ Não defina 'Content-Type' aqui
    })
  });
}
  // Atualiza as configurações de pagamento
  atualizarPagamento(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pagamento`, data, { headers: this.getHeaders() });
  }

  // Atualiza as configurações de estoque
  atualizarEstoque(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/estoque`, data, { headers: this.getHeaders() });
  }

  // Atualiza as configurações de relatórios
  atualizarRelatorios(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/relatorios`, data, { headers: this.getHeaders() });
  }

  // Atualiza as permissões do sistema
  atualizarPermissoes(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/permissoes`, data, { headers: this.getHeaders() });
  }

  // Busca permissões por perfil
  getPermissoesPorPerfil(perfil: string): Observable<PermissaoResponse> {
    return this.http.get<PermissaoResponse>(`${this.apiUrl}/permissoes`, {
      headers: this.getHeaders(),
      params: { perfil }
    });
  }

  // Atualiza as notificações
  atualizarNotificacoes(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/notificacoes`, data, { headers: this.getHeaders() });
  }

  // Cabeçalhos com token
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
  }
}
