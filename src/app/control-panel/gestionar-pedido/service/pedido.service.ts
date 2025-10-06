// src/app/control-panel/gestionar-pedido/service/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Proyecto, DatosCliente, Eventos, Servi } from '../model/pedido.model';
import { ApiPrefixService } from 'src/app/shared/services/api-prefix.service';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  selectProyecto: Proyecto = { ID: 0, Nombre: '', Fecha: '', Servicio: '', Evento: '', Cliente: '', Estado: '' };
  selectCliente:  DatosCliente = { Nombre: '', Apellido: '', Cod_Cli: 0 };
  selectServicios: Servi = { ID: 0, Nombre: '' };
  selectEventos:   Eventos = { PK_E_Cod: 0, E_Nombre: '' };

  constructor(
    private http: HttpClient,
    private api: ApiPrefixService
  ) {}

  getAllPedidos(): Observable<any> {
    const url = this.api.build('/pedido');       // ✅ sin duplicar /api
    return this.http.get<any>(url).pipe(
      tap(rows => console.log('SP_getAllPedido -> primera fila:', rows?.[0]))
    );
  }

  getDni(id: number | string): Observable<any> {
    const url = this.api.build(`/clientes/by-doc/${id}`);
    return this.http.get<any>(url);
  }

  getServicios(): Observable<any> {
    return this.http.get<any>(this.api.build('/servicios'));
  }

  getEventos(): Observable<any> {
    return this.http.get<any>(this.api.build('/eventos'));
  }
}
