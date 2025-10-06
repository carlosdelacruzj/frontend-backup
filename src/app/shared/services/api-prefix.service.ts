import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Administra el prefijo (/api o /api/v1) y construye URLs sin duplicar nada.
 * - Persiste el prefijo bueno en localStorage cuando lo descubre AuthService.
 * - Si environment.apiUrl YA termina en /api o /api/v1, ignora el prefijo guardado
 *   para evitar /api/v1/api/... o /api/v1/api/v1/...
 */
@Injectable({ providedIn: 'root' })
export class ApiPrefixService {
  private readonly storageKey = 'api_prefix';
  private readonly base = (environment.apiUrl || '').replace(/\/+$/, ''); // sin slash final
  private prefix = '';

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved != null) this.prefix = saved;
  }

  /** ✅ Guarda el prefijo detectado ('', '/api' o '/api/v1') y lo persiste. */
  public setGoodPrefix(p: string): void {
    this.prefix = (p || '').replace(/\/+$/, ''); // normaliza: '' | '/api' | '/api/v1'
    localStorage.setItem(this.storageKey, this.prefix);
  }

  /** Devuelve el prefijo actual (útil para debug). */
  public getPrefix(): string {
    return this.prefix;
  }

  /** Limpia el prefijo guardado. */
  public clearPrefix(): void {
    this.prefix = '';
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Construye una URL final:
   * - Si base YA incluye /api o /api/v1, NO añade prefijo guardado.
   * - Si base NO los incluye, añade el prefijo guardado (si lo hay).
   */
  public build(path: string): string {
    const normalizedPath = ('/' + (path || '')).replace(/\/{2,}/g, '/');
    const baseHasApi = /\/api(\/v1)?$/.test(this.base);
    const prefixToUse = baseHasApi ? '' : (this.prefix || '');
    return `${this.base}${prefixToUse}${normalizedPath}`;
  }
}
