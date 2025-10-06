import { Component, OnInit } from '@angular/core';
import { ReportesEstadisticosService } from './services/reportes-estadisticos.service';
import { Equipos, Proyecto } from './models/reportes-estadisticos.model';

@Component({
  selector: 'app-reportes-estadisticos',
  templateUrl: './reportes-estadisticos.component.html',
  styleUrls: ['./reportes-estadisticos.component.css'],
})
export class ReportesEstadisticosComponent implements OnInit {

  ngOnInit(): void {
    this.obtenerEquipos();
    this.obtenerProyectos();
    this.obtenerServicios();
    this.obtenerEstados();
    this.obtenerGanacias();
  }

  // === Datos ===
  equipos: Equipos[] = [];

  single: any[] = [];      // (si los usa tu template)
  single2: any[] = [];     // (si los usa tu template)
  single4: any[] = [];     // (si los usa tu template)
  view: any[] = [200, 200];

  proyectosReady = false;
  serviciosReady = false;
  estadosReady   = false;
  gananciasReady = false;

  Ganancias = false;

  proyectos: Proyecto = {} as Proyecto;

  data: any[] = [];            // Proyectos por mes
  dataServicios: any[] = [];   // Eventos/servicios contados
  dataEstados: any[] = [];     // Estados de proyectos
  dataGanancias: any[] = [];   // Ganancias

  // === Opciones de gráficos ===
  gradient = true;
  showLegend = false;
  showLabels = true;
  isDoughnut = false;
  legendPosition = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  showXAxis = true;
  showYAxis = true;
  gradient2 = false;
  showLegend2 = true;
  showXAxisLabel = true;
  xAxisLabel = 'Cantidad';
  showYAxisLabel = true;
  yAxisLabel = 'Mes';

  constructor(private service: ReportesEstadisticosService) {}

  // ============= Métodos =============

  obtenerEquipos() {
    this.service.getEquipos().subscribe({
      next: (res: any) => {
        // si viene array directo:
        if (Array.isArray(res)) {
          this.equipos = res as Equipos[];
        } else {
          // si viene como objeto de objetos/arrays
          this.equipos = Object.values(res ?? {}) as Equipos[];
        }
      },
      error: (err) => {
        console.error('[dashboard] getEquipos', err);
        this.equipos = [];
      }
    });
  }

  obtenerServicios() {
    this.dataServicios = [];
    this.service.getEventos().subscribe({
      next: (res: any) => {
        const arr = Array.isArray(res) ? res : Object.values(res ?? {});
        for (const item of arr) {
          const name = `${item?.servicio ?? 'Servicio'} - ${item?.evento ?? 'Evento'} - ${item?.nombre ?? 'N/A'}`;
          const value = Number(item?.cantidad ?? 0);
          this.dataServicios.push({ name, value });
        }
        this.serviciosReady = true;
      },
      error: (err) => {
        console.error('[dashboard] getEventos', err);
        this.dataServicios = [];
        this.serviciosReady = true; // marcamos para no dejar loaders colgados
      }
    });
  }

  obtenerProyectos() {
    this.data = [];
    this.service.getProyectos().subscribe({
      next: (res: any) => {
        // Soporta dos formatos:
        // A) [{ mes1: 1, mes2: 2, ... }]
        // B) [1,2,3,...]  ó  {0:1,1:2,...}
        if (Array.isArray(res) && res.length && typeof res[0] === 'object' && !Array.isArray(res[0])) {
          const obj = res[0];
          const keys = Object.keys(obj);
          // si keys son "mes1","mes2"... los usamos; si son otras, igual
          for (const k of keys) {
            this.data.push({ name: k, value: Number(obj[k] ?? 0) });
          }
        } else {
          const values = Array.isArray(res) ? res : Object.values(res ?? {});
          for (let i = 0; i < values.length; i++) {
            this.data.push({ name: 'mes' + (i + 1), value: Number(values[i] ?? 0) });
          }
        }
        this.proyectosReady = true;
      },
      error: (err) => {
        console.error('[dashboard] getProyectos', err);
        this.data = [];
        this.proyectosReady = true;
      }
    });
  }

  obtenerEstados() {
    this.dataEstados = [];
    this.service.getEstados().subscribe({
      next: (res: any) => {
        // esperado: { "En Proceso": 2, "Finalizado": 3, ... } o [{...}]
        const src = Array.isArray(res) ? (res[0] ?? {}) : (res ?? {});
        const keys = Object.keys(src);
        for (const k of keys) {
          this.dataEstados.push({ name: k, value: Number(src[k] ?? 0) });
        }
        this.estadosReady = true;
      },
      error: (err) => {
        console.error('[dashboard] getEstados', err);
        this.dataEstados = [];
        this.estadosReady = true;
      }
    });
  }

  obtenerGanacias() {
    this.dataGanancias = [];
    this.service.getGanancias().subscribe({
      next: (res: any) => {
        // esperado: { "Enero": 1000, "Febrero": 500, ... } o [{...}]
        const src = Array.isArray(res) ? (res[0] ?? {}) : (res ?? {});
        const keys = Object.keys(src);
        for (const k of keys) {
          const raw = src[k];
          const value = raw == null ? 0 : Number(raw);
          this.dataGanancias.push({ name: k, value });
        }
        this.gananciasReady = true;
      },
      error: (err) => {
        console.error('[dashboard] getGanancias', err);
        this.dataGanancias = [];
        this.gananciasReady = true;
      }
    });
  }

  showGanancias() {
    this.Ganancias = true;
  }

  showProyectos() {
    this.Ganancias = false;
  }
}
