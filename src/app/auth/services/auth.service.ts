// src/app/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, from } from 'rxjs';
import { catchError, concatMap, map, tap, filter, take, defaultIfEmpty } from 'rxjs/operators';
import { AuthResponse, Usuario } from '../interfaces/auth.interface';
import { ApiPrefixService } from 'src/app/shared/services/api-prefix.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private domain = environment.apiUrl;        // sin /api ni /v1
  private prefixes = ['', '/api', '/api/v1']; // orden de prueba
  private _usuario: Usuario | null = null;

  get usuario(): Usuario | null { return this._usuario; }

  constructor(
    private http: HttpClient,
    private apiPrefix: ApiPrefixService
  ) {}

  /** Intenta login moderno y, si 404, legacy. Repite contra varios prefijos hasta que alguno sirva. */
  login(correo: string, pass: string): Observable<boolean> {
    return from(this.prefixes).pipe(
      concatMap(prefix => this.tryLoginWithPrefix(prefix, correo, pass)),
      filter((v): v is boolean => typeof v === 'boolean'),
      take(1),
      defaultIfEmpty(false)
    );
  }

  private tryLoginWithPrefix(prefix: string, correo: string, pass: string): Observable<boolean | 'next'> {
    const modernUrl = `${this.domain}${prefix}/auth/login`;

    return this.http.post<AuthResponse>(modernUrl, { correo, pass }).pipe(
      tap(() => {
        console.log(`[auth] OK (modern): ${modernUrl}`);
        this.apiPrefix.setGoodPrefix(prefix); // ✅ guarda prefijo exitoso
      }),
      tap((resp) => this.persistUserFromModern(resp, correo)),
      map((resp) => !!resp?.token),
      catchError((err: HttpErrorResponse) => {
        if (err?.status === 404) {
          const legacyUrl = `${this.domain}${prefix}/usuario/consulta/getIniciarSesion/${correo}/${pass}`;
          return this.http.get<any>(legacyUrl).pipe(
            tap(() => {
              console.log(`[auth] OK (legacy): ${legacyUrl}`);
              this.apiPrefix.setGoodPrefix(prefix);
            }),
            map((resp) => Array.isArray(resp) ? resp[0] : resp),
            tap((r) => this.persistUserFromLegacy(r, correo)),
            map((r) => !!r?.token),
            catchError((legacyErr: HttpErrorResponse) => {
              if (legacyErr?.status === 404) {
                console.warn(`[auth] 404 en ${modernUrl} y ${legacyUrl}. Probando siguiente prefijo…`);
                return of<'next'>('next');
              }
              console.error('[auth] login error (legacy)', legacyErr);
              this._usuario = null;
              return of(false);
            })
          );
        }
        console.error('[auth] login error (modern)', err);
        this._usuario = null;
        return of(false);
      })
    );
  }

  /** ---------- helpers de mapeo/estado ---------- */
  private persistUserFromModern(resp: AuthResponse | null | undefined, correo: string): void {
    if (resp?.token) {
      localStorage.setItem('token', resp.token);
      localStorage.setItem('correo', correo);
      this._usuario = {
        nombre: resp.nombre,
        apellido: resp.apellido,
        ID: resp.ID,
        documento: resp.documento,
        rol: resp.rol,
        token: resp.token,
      };
    } else {
      this._usuario = null;
    }
  }

  private persistUserFromLegacy(r: any, correo: string): void {
    if (r?.token) {
      localStorage.setItem('token', r.token);
      localStorage.setItem('correo', correo);
      this._usuario = {
        nombre: r.nombre,
        apellido: r.apellido,
        ID: r.ID,
        documento: r.documento,
        rol: r.rol,
        token: r.token,
      };
    } else {
      this._usuario = null;
    }
  }

  /** Valida código (reintentando por prefijos). */
  validacion(correo: string, codigo: number): Observable<boolean> {
    return from(this.prefixes).pipe(
      concatMap(prefix => this.tryValidacionWithPrefix(prefix, correo, codigo)),
      filter((v): v is boolean => typeof v === 'boolean'),
      take(1),
      defaultIfEmpty(false)
    );
  }

  private tryValidacionWithPrefix(prefix: string, correo: string, codigo: number): Observable<boolean | 'next'> {
    const url = `${this.domain}${prefix}/usuario/consulta/getValidacionCodex/${correo}/${codigo}`;
    return this.http.get<any>(url).pipe(
      tap(() => console.log(`[auth] validacion OK: ${url}`)),
      map((resp) => Array.isArray(resp) ? resp[0] : resp),
      map((r) => r?.validacion === 1 || r?.validacion === true),
      catchError((err: HttpErrorResponse) => {
        if (err?.status === 404) return of<'next'>('next');
        console.error('[auth] validacion error', err);
        return of(false);
      })
    );
  }

  /** Verifica si hay sesión activa */
  verificaAuteticacion(): Observable<boolean> {
    const token = localStorage.getItem('token');
    return of(!!token);
  }

  logout(): void {
    localStorage.clear();
    this._usuario = null;
  }
}
