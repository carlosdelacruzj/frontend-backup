import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReportesEstadisticosService {
  private readonly base = environment.apiUrl; // e.g. https://.../api

  constructor(private http: HttpClient) {}

  private getWithFallback(pathNoV1: string, pathV1: string): Observable<any> {
    const url1 = `${this.base}${pathNoV1}`;
    const url2 = `${this.base}${pathV1}`;

    return this.http.get(url1).pipe(
      catchError(err => {
        if (err?.status === 404) {
          // intenta la variante /v1
          return this.http.get(url2);
        }
        throw err;
      })
    );
  }

  getEquipos(): Observable<any> {
    // /api/dashboard/...  -> fallback /api/v1/dashboard/...
    return this.getWithFallback('/dashboard/reporte-lista-equipo',
                                '/v1/dashboard/reporte-lista-equipo');
  }

  getProyectos(): Observable<any> {
    return this.getWithFallback('/dashboard/reporte-proyectos-mes',
                                '/v1/dashboard/reporte-proyectos-mes');
  }

  getEventos(): Observable<any> {
    return this.getWithFallback('/dashboard/reporte-eventos-contado',
                                '/v1/dashboard/reporte-eventos-contado');
  }

  getEstados(): Observable<any> {
    return this.getWithFallback('/dashboard/reporte-estado-proyectos',
                                '/v1/dashboard/reporte-estado-proyectos');
  }

  getGanancias(): Observable<any> {
    return this.getWithFallback('/dashboard/reporte-ganancias',
                                '/v1/dashboard/reporte-ganancias');
  }
}
