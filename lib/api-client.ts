const API_BASE_URL = 'http://localhost:3001/v1'

interface ApiClientOptions { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; body?: unknown; headers?: Record<string, string>; requireAuth?: boolean; }
interface ApiResponse<T> { success: boolean; data?: T; status: number; }

class ApiClientError extends Error {
  status: number; response?: unknown;
  constructor(message: string, status: number, response?: unknown) { super(message); this.name = 'ApiClientError'; this.status = status; this.response = response; }
}

export class ApiClient {
  private baseURL: string;
  constructor(baseURL: string = API_BASE_URL) { this.baseURL = baseURL.replace(/\/$/, ''); }
  private getAccessToken(): string | null { if (typeof window === 'undefined') return null; return localStorage.getItem('frcabuloso_token'); }
  private async renovarToken(): Promise<string | null> {
    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) { const data = await res.json(); if (data.accessToken) { localStorage.setItem('frcabuloso_token', data.accessToken); return data.accessToken; } }
    } catch (e) {}
    return null;
  }

  async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, requireAuth = true } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const reqHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...headers };
    if (requireAuth) {
      const token = this.getAccessToken();
      if (!token) { if (typeof window !== 'undefined') window.location.href = '/login'; throw new ApiClientError('Acesso negado', 401); }
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await fetch(url, { method, headers: reqHeaders, credentials: 'include', body: body ? JSON.stringify(body) : undefined, redirect: 'manual' });
      if (res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)) { if (typeof window !== 'undefined' && requireAuth) window.location.href = '/login'; throw new ApiClientError('Falha de rota', res.status); }
      const ct = res.headers.get('content-type');
      let data: any = {};
      if (ct?.includes('application/json')) { try { data = await res.json(); } catch (e) { data = { erro: 'Falha nos dados' }; } }
      else { const text = await res.text().catch(() => ""); if (text.includes('<!DOCTYPE') || text.includes('<html')) { if (res.status === 401 && typeof window !== 'undefined') { localStorage.removeItem('frcabuloso_token'); window.location.href = '/login'; } data = { erro: 'Resposta inválida' }; } else { data = { mensagem: text || 'Vazio' }; } }
      if (res.status === 401 && requireAuth) {
        const nt = await this.renovarToken();
        if (nt) { reqHeaders['Authorization'] = `Bearer ${nt}`; const rr = await fetch(url, { method, headers: reqHeaders, credentials: 'include', body: body ? JSON.stringify(body) : undefined }); const rd = await rr.json().catch(() => ({})); if (rr.ok) return { success: true, data: rd, status: rr.status }; }
        if (typeof window !== 'undefined') { localStorage.removeItem('frcabuloso_token'); localStorage.removeItem('frcabuloso_user'); setTimeout(() => window.location.href = '/login', 100); }
        throw new ApiClientError('Sessão expirada', 401, data);
      }
      if (!res.ok) throw new ApiClientError(data.erro || 'Erro', res.status, data);
      return { success: true, data, status: res.status };
    } catch (error) { if (error instanceof ApiClientError) throw error; throw new ApiClientError('Falha de conexão', 0); }
  }
  async get<T>(e: string, o?: any) { return this.request<T>(e, { ...o, method: 'GET' }); }
  async post<T>(e: string, b?: any, o?: any) { return this.request<T>(e, { ...o, method: 'POST', body: b }); }
  async delete<T>(e: string, o?: any) { return this.request<T>(e, { ...o, method: 'DELETE' }); }
}
export const apiClient = new ApiClient()
