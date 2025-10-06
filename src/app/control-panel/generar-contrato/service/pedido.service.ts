import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, Pedido2 } from '../model/pedido.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  selectPedido: Pedido = {
    ID: 0,
    Nombre: '',
    Fecha: '',
    Servicio: '',
    Evento: '',
    Cliente: '',
    Estado: '',
    EstadoPago: ''
  };

  selectPedido2: Pedido2 = {
    Empleado: '',
    N_Pedido: 0,
    Cliente: '',
    F_Registro: '',
    EstadoPedido: '',
    Costo_Total: '',
    Acuenta: '',
    EstadoPago: '',
    Evento: '',
    Servicio: '',
    F_Evento: '',
    Hora_Evento: '',
    Direccion: '',
    Descripcion: '',
    NombrePedido: '',
    correo: ''
  };

  pedido: Pedido[] = [];
  pedido2: Pedido2[] = [];

  // 👇 Base unificada
  private readonly API = environment.apiUrl; // e.g. https://tesis-backend-node.onrender.com/api/v1

  constructor(private http: HttpClient) {}

  // === ENDPOINTS REALS A TU API ===
  getAllNombres(): Observable<any> {
    return this.http.get(`${this.API}/pedido`);
  }

  getAllNombresID(id: any): Observable<any> {
    return this.http.get(`${this.API}/pedido/${id}`);
  }

  // 👇 Estas dos eran las que te estaban llamando al 4200
  getServicios(): Observable<any> {
    return this.http.get(`${this.API}/servicios`);
  }

  getEventos(): Observable<any> {
    return this.http.get(`${this.API}/eventos`);
  }
}
