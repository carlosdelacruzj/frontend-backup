import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  countEstadosPorModelo,
  detalleEquipoAlquilado,
  empleadosAll,
  EquipoAll,
  EquipoAllGroup,
  EquipoAllMARCA,
  EquipoAllMarcaTipo,
  EquipoRegistrar,
  equiposAlquilados,
  EquipoTipoAll,
  EquipoTipoAllID,
  EquipoTipoAllIDMARCAMODELO,
  existeSerie,
  lProyectos,
  rAlquilado,
  updateAlquilados,
  updateStatus,
} from '../models/modeloprueba.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdministrarEquiposService {
  selectTipoAll: EquipoTipoAll = {
    PK_TE_Cod: 0,
    TE_Nombre: '',
  };

  selectAll: EquipoAll = {
    Nombre: '',
    Marca: '',
    Modelo: '',
    Estado: '',
  };

  selectTipoAllID: EquipoTipoAllID = {
    Codigo: '',
    Marca: '',
    Modelo: '',
    Estado: '',
  };

  selectTipoAllIDMARCAMODELO: EquipoTipoAllIDMARCAMODELO = {
    Equipo: '',
    Marca: '',
    Modelo: '',
    Serie: '',
    Fecha: '',
    Estado: '',
  };

  selectGroup: EquipoAllGroup = {
    Equipo: '',
    Marca: '',
    Modelo: '',
    IdEquipo: 0,
    IdMarca: 0,
    IdModelo: 0,
    Cantidad: 0,
  };

  selectAllMarca: EquipoAllMARCA = {
    Id: 0,
    Nombre: '',
  };

  selectMarcaTipo: EquipoAllMarcaTipo = {
    Id: 0,
    Nombre: '',
  };

  registerEquipo: EquipoRegistrar = {
    idEquipo: '',
    fecha: '',
    modelo: 0,
  };

  cEstadosModelo: countEstadosPorModelo = {
    Disponible: 0,
    EnUso: 0,
    Mantenimiento: 0,
    NoDisponible: 0,
  };

  putStatus: updateStatus = {
    idEquipo: '',
  };

  esSerie: existeSerie = {
    existe: 0,
  };

  allAquilados: equiposAlquilados = {
    tipoEquipo: '',
    serie: '',
    proyectoAsig: '',
    empleadoAsig: '',
    estado: '',
    id: 0,
  };

  infoAlquilado: detalleEquipoAlquilado = {
    tipoEquipo: '',
    marca: '',
    modelo: '',
    serie: '',
    fechaEntrada: '',
    fechaSalida: '',
    estado: '',
    proyectoAsig: '',
    empleadoAsig: '',
    id: 0,
  };

  postAlquilado: rAlquilado = {
    tipoEquipo: '',
    marca: '',
    modelo: '',
    serie: '',
    fechaEntrada: '',
    fechaSalida: '',
    fk_Pro_Cod: 0,
    fk_Empleado_Cod: 0,
    estado: '',
  };

  listarProyectos: lProyectos = {
    ID: 0,
    Nombre: '',
    Fecha: '',
    Servicio: '',
    Evento: '',
    Estado: 0,
  };

  listarEmpledos: empleadosAll = {
    ID: 0,
    Nombre: '',
    Apellido: '',
    Car_Nombre: '',
    DNI: '',
    Celular: '',
    Correo: '',
    Autonomo: 0,
    Cargo: '',
    Estado: '',
  };

  upAlquilados: updateAlquilados = {
    proyecto: 0,
    fechaSalida: '',
    empleado: 0,
    codigo: 0,
  };

  private readonly base = `${environment.apiUrl}/equipo`;
  private EQUIPO_TIPOALL =
    'https://tp2021database.herokuapp.com/equipo/consulta/getAllTipoEquipo';

  private EQUIPO_ALL =
    'https://tp2021database.herokuapp.com/equipo/consulta/getAllEquipo';

  private EQUIPO_TIPOALLID =
    'https://tp2021database.herokuapp.com/equipo/consulta/getByTipoEquipo/';

  // private EQUIPO_TIPOIDMARCAMODELO =
  //   'https://tp2021database.herokuapp.com/equipo/consulta/getAllEquiposByIdGroup';
  private EQUIPO_TIPOIDMARCAMODELO = this.base + '/by-grupo';

  // private EQUIPO_ALLGROUP =
  //   'https://tp2021database.herokuapp.com/equipo/consulta/getAllEquiposGroup';

  private EQUIPO_ALLGROUP = this.base + '/grupos';

  private EQUIPO_ALLMARCA ='https://tp2021database.herokuapp.com/equipo/consulta/getAllMarca';

  private EQUIPO_ALLMODELO =
    'https://tp2021database.herokuapp.com/equipo/consulta/getAllModelo/';

  private REGISTER_EQUIPO =
    'https://tp2021database.herokuapp.com/equipo/registro/postEquipo';

  // private COUNT_ESTADOS =
  //   'https://tp2021database.herokuapp.com/equipo/consulta/getAllContadoresEquiposEstado';

  private COUNT_ESTADOS = this.base + '/contadores';
  private PUT_STATUS =
    'https://tp2021database.herokuapp.com/equipo/actualiza/putEstadoEquipo';

  // private EXI_SERIE =
  //   'https://tp2021database.herokuapp.com/equipo/consulta/getExistEquipo';
  private EXI_SERIE = this.base + '/existe';

  private GET_EQUIPOSA =
    'https://tp2021database.herokuapp.com/equiposAlquilado/consulta/getAllEquiposAlquilado';

  private GET_DETALLESA =
    'https://tp2021database.herokuapp.com/equiposAlquilado/consulta/getEquipoAlquiladoByID';

  private R_EQUIPO_A =
    'https://tp2021database.herokuapp.com/equiposAlquilado/registro/postEquipoAlquilado';

  private ALL_PROYECTOS =
    'https://tp2021database.herokuapp.com/proyecto/consulta/getAllAsignarEquipos';

  private ALL_EMPLEADOS =
    'https://tp2021database.herokuapp.com/empleado/consulta/getAllEmpleados';

  private PUT_ALQUILADO =
    'https://tp2021database.herokuapp.com/equiposAlquilado/actualiza/putEquipoAlquilado';

  constructor(private http: HttpClient) { }

  public putEAlquilado(data: any): Observable<any> {
    return this.http.put(this.PUT_ALQUILADO, data);
  }
  public getAllProyectos(): Observable<any> {
    return this.http.get(this.ALL_PROYECTOS);
  }
  public getAllEmpleados(): Observable<any> {
    return this.http.get(this.ALL_EMPLEADOS);
  }
  // definir los gets
  public getAll(): Observable<any> {
    return this.http.get(this.EQUIPO_ALL);
  }
  // TRAER DATOS | ( EQUIPO, MARCA, MODELO)
  public getAllGroup(): Observable<any> {
    console.log('servicio de grupos');
    return this.http.get(this.EQUIPO_ALLGROUP);
  }
  // POR TIPO DE EQUIPO
  public getTipoEquipo(): Observable<any> {
    return this.http.get(this.EQUIPO_TIPOALL);
  }
  // POR MARCA DE EQUIPO
  public getMarcaEquipo(): Observable<any> {
    return this.http.get(this.EQUIPO_ALLMARCA);
  }
  // POR EQUIPO MARCA MODELO
  public getEquipoMarcaModelo(
    idEquipo: number,
    idMarca: number,
    idModelo: number
  ): Observable<any> {
    return this.http.get(
      `${this.EQUIPO_TIPOIDMARCAMODELO}/${idEquipo}/${idMarca}/${idModelo}`
    );
  }
  //Para sacar la leyenda de estados recibe el ID del modelo
  public getCountEstados(idModelo: number): Observable<any> {
    return this.http.get(`${this.COUNT_ESTADOS}/${idModelo}`);
  }
  //Actualizar estado por serie=idequipo, se envia cambia de estado entre disponible o mantenimieto
  public updateStatus(idEquipo: string): Observable<any> {
    const body = {
      idEquipo,
    };
    return this.http.put(`${this.PUT_STATUS}`, body);
  }
  //Existe serie o no
  public getExisteSerie(idEquipo: string): Observable<any> {
    return this.http.get(`${this.EXI_SERIE}/${idEquipo}`);
  }
  //registro de un nuevo equipo uwu
  public rEquipo(data: any): Observable<any> {
    return this.http.post(this.REGISTER_EQUIPO, data);
  }
  //r e a
  public rEquipoA(data: any): Observable<any> {
    return this.http.post(this.R_EQUIPO_A, data);
  }
  //Listar Equipos Alquilados
  public getEquiposAlquilados(): Observable<any> {
    return this.http.get(this.GET_EQUIPOSA);
  }
  //Detalles del equipo alquilado por su id
  public getDetallesAlquilado(id: number): Observable<any> {
    return this.http.get(`${this.GET_DETALLESA}/${id}`);
  }
}
