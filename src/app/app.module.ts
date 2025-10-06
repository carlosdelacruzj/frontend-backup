import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './shared/angular-material/spanish-paginator-intl';

import { AppComponent } from './app.component';
import { GestionarEquiposComponent } from './control-panel/gestionar-equipos/gestionar-equipos.component';
import { DashboardComponent } from './control-panel/dashboard/dashboard.component';
import { GenerarContratoComponent } from './control-panel/generar-contrato/generar-contrato.component';
import { AdministrarPaqueteServicioComponent } from './control-panel/administrar-paquete-servicio/administrar-paquete-servicio.component';
import { EventCardComponent } from './control-panel/administrar-paquete-servicio/components/event-card/event-card.component';
import { EventServiceComponent } from './control-panel/administrar-paquete-servicio/components/event-service/event-service.component';
import { DetalleServiciosComponent } from './control-panel/administrar-paquete-servicio/components/detalle-servicios/detalle-servicios.component';
import { GestionarProyectoComponent } from './control-panel/gestionar-proyecto/listar-proyecto/gestionar-proyecto.component';
import { AgregarProyectoComponent } from './control-panel/gestionar-proyecto/agregar-proyecto/agregar-proyecto.component';
import { GestionarPedidoComponent } from './control-panel/gestionar-pedido/gestionar-pedido.component';
import { ActualizarProyectoComponent } from './control-panel/gestionar-proyecto/actualizar-proyecto/actualizar-proyecto.component';
import { EditarServicioComponent } from './control-panel/administrar-paquete-servicio/components/editar-servicio/editar-servicio.component';
import { AdministrarEquiposComponent } from './control-panel/administrar-equipos/administrar-equipos.component';
import { GestionarPersonalComponent } from './control-panel/gestionar-personal/gestionar-personal.component';
import { AgregarPersonalComponent } from './control-panel/gestionar-personal/agregar-personal/agregar-personal.component';
import { ListarportipoComponent } from './control-panel/administrar-equipos/listarportipo/listarportipo.component';
import { DetallesAlquiladoComponent } from './control-panel/administrar-equipos/detalles-alquilado/detalles-alquilado.component';
import { RegistrarPagoComponent } from './control-panel/registrar-pago/registrar-pago.component';
import { ContratoComponent } from './control-panel/generar-contrato/contrato/contrato.component';
import { AgregarPedidoComponent } from './control-panel/gestionar-pedido/agregar-pedido/agregar-pedido.component';
import { DetallePedidoComponent } from './control-panel/gestionar-pedido/detalle-pedido/detalle-pedido.component';
import { ActualizarPedidoComponent } from './control-panel/gestionar-pedido/actualizar-pedido/actualizar-pedido.component';
import { ReportesEstadisticosComponent } from './control-panel/reportes-estadisticos/reportes-estadisticos.component';
import { GestionarClienteComponent } from './control-panel/gestionar-cliente/gestionar-cliente.component';
import { RegistrarClienteComponent } from './control-panel/gestionar-cliente/registrar-cliente/registrar-cliente.component';
import { EditarClienteComponent } from './control-panel/gestionar-cliente/editar-cliente/editar-cliente.component';
import { GestionarPerfilesComponent } from './control-panel/gestionar-perfiles/gestionar-perfiles.component';
import { RegistrarPerfilComponent } from './control-panel/gestionar-perfiles/registrar-perfil/registrar-perfil.component';
import { EditarPerfilComponent } from './control-panel/gestionar-perfiles/editar-perfil/editar-perfil.component';
import { VerCalendarioComponent } from './control-panel/ver-calendario/ver-calendario.component';
import { DialogComponent } from './control-panel/ver-calendario/dialog/dialog.component';

// 👇 IMPORTA el LandingComponent
import { LandingComponent } from './landing/landing.component';

/** 🔒 Interceptor inline para agregar Authorization si hay token */
const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const token = localStorage.getItem('token');
    if (token) req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  } catch {}
  return next(req);
};

@NgModule({
  declarations: [
    AppComponent,
    GestionarProyectoComponent,
    GestionarEquiposComponent,
    DashboardComponent,
    AgregarProyectoComponent,
    GestionarPedidoComponent,
    AdministrarPaqueteServicioComponent,
    EventCardComponent,
    EventServiceComponent,
    DetalleServiciosComponent,
    ActualizarProyectoComponent,
    EditarServicioComponent,
    AdministrarEquiposComponent,
    GestionarPersonalComponent,
    AgregarPersonalComponent,
    ListarportipoComponent,
    RegistrarPagoComponent,
    GenerarContratoComponent,
    ContratoComponent,
    AgregarPedidoComponent,
    DetallePedidoComponent,
    ActualizarPedidoComponent,
    ReportesEstadisticosComponent,
    GestionarClienteComponent,
    RegistrarClienteComponent,
    EditarClienteComponent,
    GestionarPerfilesComponent,
    RegistrarPerfilComponent,
    EditarPerfilComponent,
    DetallesAlquiladoComponent,
    VerCalendarioComponent,
    DialogComponent,
    // 👇 AGREGA el LandingComponent aquí
    LandingComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    NgbModule,
    NgxChartsModule,
    FullCalendarModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    DatePipe,
    provideHttpClient(withInterceptors([authTokenInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
