import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PedidoService } from '../service/pedido.service';
import { VisualizarService } from '../service/visualizar.service';
import swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotesService } from 'src/app/quote/quotes.service';



@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})


export class DetallePedidoComponent implements OnInit, AfterViewInit {
  // ====== Columnas (solo lectura) ======
  columnsToDisplay = ['Nro', 'Fecha', 'Hora', 'Direccion', 'DireccionExacta', 'Notas']; // sin Editar/Quitar
  columnsToDisplay1 = ['Descripcion', 'Precio']; // sin Seleccionar
  // Campos “sólo lectura” para los inputs de cabecera de evento
  Direccion: string = '';
  DireccionExacta: string = '';
  NotasEvento: string = '';
  // ====== Catálogos (solo para mostrar combos deshabilitados) ======
  servicios: any[] = [];
  evento: any[] = [];
  servicioSeleccionado = 1;
  eventoSeleccionado = 1;
  loading = false;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSource1: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild('sortUbic') sortUbic!: MatSort;
  @ViewChild('sortPaq') sortPaq!: MatSort;

  private bindSorts() {
    if (this.sortUbic) this.dataSource.sort = this.sortUbic;
    if (this.sortPaq) this.dataSource1.sort = this.sortPaq;
  }

  // ====== Estado general ======
  CodigoEmpleado: number = 1;
  infoCliente = { nombre: '-', apellido: '-', celular: '-', correo: '-', documento: '-', direccion: '-', idCliente: 0, idUsuario: 0 };
  dniCliente: any;

  // ====== Fechas visibles ======
  fechaCreate: Date = new Date();
  minimo = '';
  maximo = '';

  // ====== Ubicaciones ======
  ubicacion: Array<{ ID: number; dbId: number; Direccion: string; Fecha: string; Hora: string; DireccionExacta: string; Notas: string; }> = [];

  // ====== Paquetes seleccionados (solo para mostrar) ======
  selectedPaquetes: Array<{
    id?: number;
    key: string | number;
    eventKey: string | number | null;
    ID?: number;
    descripcion: string;
    precio: number;
    notas: string;
  }> = [];

  // ====== Pedido actual ======
  private pedidoId!: number;

  constructor(
    public pedidoService: PedidoService,
    public visualizarService: VisualizarService,
    private route: ActivatedRoute,
    private router: Router,
    private quotes: QuotesService

  ) { }
  logoBase64?: string;
  // ====== Ciclo de vida ======
  async ngOnInit(): Promise<void> {
    await this.loadLogo();
    this.pedidoId = +(this.route.snapshot.paramMap.get('id') || 0);
    if (!this.pedidoId) {
      swal.fire({
        text: 'ID de pedido inválido.',
        icon: 'error',
        showCancelButton: false,
        customClass: { confirmButton: 'btn btn-danger' },
        buttonsStyling: false
      });
      this.router.navigate(['/home/gestionar-pedido']);
      return;
    }

    // Opcional: cargar catálogos para combos deshabilitados
    this.getServicio();
    this.getEventos();
    this.getEventoxServicio();

    // Inicializa cabecera visible
    this.visualizarService.selectAgregarPedido.fechaCreate = this.fechaCreate.toLocaleDateString();
    this.fechaValidate(this.fechaCreate);

    // Cargar el pedido existente (solo para ver)
    this.loadPedido(this.pedidoId);
  }

  ngAfterViewInit(): void {
    this.bindSorts();
  }

  // ====== Utiles fecha/hora ======
  fechaValidate(date: Date) {
    this.minimo = this.addDaysToDate(date, -365);
    this.maximo = this.addDaysToDate(date, 365);
  }

  convert(strOrDate: string | Date) {
    const date = new Date(strOrDate);
    const mnth = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  addDaysToDate(date: Date, days: number) {
    const res = new Date(date);
    res.setDate(res.getDate() + days);
    return this.convert(res);
  }

  weekdayPeru(fechaISO: string): string {
    if (!fechaISO) return '';
    const [y, m, d] = fechaISO.split('-').map(Number);
    const dtUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const fmt = new Intl.DateTimeFormat('es-PE', { weekday: 'short', timeZone: 'America/Lima' });
    return fmt.format(dtUTC);
  }

  // ====== Catálogos (solo carga) ======
  getServicio() {
    const obs: any = this.pedidoService.getServicios?.();
    if (!obs || typeof obs.subscribe !== 'function') { this.servicios = []; return; }
    obs.pipe(catchError(() => of([]))).subscribe((res: any) => { this.servicios = res ?? []; });
  }

  getEventos() {
    const obs: any = this.pedidoService.getEventos?.();
    if (!obs || typeof obs.subscribe !== 'function') { this.evento = []; return; }
    obs.pipe(catchError(() => of([]))).subscribe((res: any) => { this.evento = res ?? []; });
  }

  getEventoxServicio() {
    const obs: any = this.visualizarService?.getEventosServicio?.(this.eventoSeleccionado, this.servicioSeleccionado);
    if (!obs || typeof obs.subscribe !== 'function') { this.dataSource1.data = []; this.bindSorts(); return; }
    obs.pipe(catchError(() => of([]))).subscribe((res: any) => {
      this.dataSource1.data = res ?? [];
      this.bindSorts();
    });
  }

  // ====== Carga del pedido existente (solo mapeo) ======
  private loadPedido(id: number) {
    const obs: any = this.visualizarService.getPedidoById?.(id);
    if (!obs || typeof obs.subscribe !== 'function') return;

    obs.pipe(
      catchError((err: any) => {
        console.error('[getPedidoById] error', err);
        swal.fire({
          text: 'No se pudo cargar el pedido.',
          icon: 'error',
          showCancelButton: false,
          customClass: { confirmButton: 'btn btn-danger' },
          buttonsStyling: false
        });
        return of(null);
      })
    ).subscribe((data: any) => {
      if (!data) return;

      const cab = data.pedido || data;
      this.visualizarService.selectAgregarPedido.NombrePedido = cab?.nombrePedido ?? cab?.nombre ?? '';
      this.visualizarService.selectAgregarPedido.Observacion = cab?.observaciones ?? '';
      this.CodigoEmpleado = cab?.empleadoId ?? this.CodigoEmpleado;
      this.fechaCreate = new Date(cab?.fechaCreacion ?? new Date());
      this.visualizarService.selectAgregarPedido.fechaCreate = this.fechaCreate.toLocaleDateString();

      // Cliente
      this.infoCliente = {
        nombre: cab?.cliente?.nombres ?? '-',
        apellido: cab?.cliente?.apellidos ?? '-',
        celular: cab?.cliente?.celular ?? '-',
        correo: cab?.cliente?.correo ?? '-',
        documento: cab?.cliente?.documento ?? '-',
        direccion: cab?.cliente?.direccion ?? '-',
        idCliente: cab?.clienteId ?? cab?.cliente?.id ?? 0,
        idUsuario: 0
      };
      this.dniCliente = this.infoCliente.documento || '';

      // Eventos
      this.ubicacion = (data.eventos || []).map((e: any, idx: number) => ({
        ID: idx + 1,
        dbId: e.id ?? e.dbId ?? 0,
        Direccion: e.ubicacion ?? '',
        Fecha: String(e.fecha).slice(0, 10),
        Hora: String(e.hora).slice(0, 5),
        DireccionExacta: e.direccion ?? '',
        Notas: e.notas ?? ''
      }));
      this.dataSource.data = this.ubicacion;
      this.bindSorts();

      // Items/paquetes seleccionados (para mostrar tabla resumen)
      this.selectedPaquetes = (data.items || []).map((it: any) => ({
        id: it.id,
        key: it.exsId ?? it.id ?? `${it.nombre ?? it.descripcion}|${it.precioUnit ?? it.precio ?? 0}`,
        eventKey: it.eventoCodigo ?? null,
        ID: it.exsId ?? it.id ?? null,
        descripcion: it.nombre ?? it.descripcion ?? '',
        precio: Number(it.precioUnit ?? it.precio ?? 0),
        notas: it.notas ?? ''
      }));
    });
  }

  // ====== Helpers de plantilla (solo lectura) ======
  get totalSeleccion(): number {
    return this.selectedPaquetes.reduce((sum, p) => sum + (+p.precio || 0), 0);
  }

  // ====== agrega este método al final de la clase ======
  // ====== reemplaza TODO tu método por este ======
generarCotizacion() {
  this.loading = true;

  // 1) Datos base ya visibles en la pantalla
  const ev = this.ubicacion?.[0] || null;
  const nombrePedido = this.visualizarService?.selectAgregarPedido?.NombrePedido || '';
  const observaciones = this.visualizarService?.selectAgregarPedido?.Observacion || '';

  // Fecha formateada como "YYYY-MM-DD (dom)"
  const fechaISO = ev?.Fecha || '';
  const fechaConDia = fechaISO ? `${fechaISO} (${this.weekdayPeru(fechaISO)})` : '-';

  // 2) Items mapeados desde tu tabla (cantidad = 1)
  const itemsMapped = (this.selectedPaquetes || []).map(x => ({
    descripcion: x.descripcion || '-',
    precio: Number(x.precio || 0),
    cantidad: 1
  }));

  // 3) Totales por tipo (heurística simple por palabras clave)
  const isFoto = (d: string) => /foto|fotografía|phot/i.test(d || '');
  const isVideo = (d: string) => /video|vídeo/i.test(d || '');

  let totalFoto = 0, totalVideo = 0;
  for (const it of itemsMapped) {
    if (isVideo(it.descripcion)) totalVideo += it.precio * (it.cantidad || 1);
    else totalFoto += it.precio * (it.cantidad || 1); // por defecto cae en Foto
  }

  // 4) Payload con el formato de la plantilla
  const payload = {
    // ----- Cabecera -----
    company: {
      name: "D’ La Cruz Video y Fotografía",
      logoBase64: this.logoBase64, // <--- agrega esto
      footerText: 'Telf: 7481252 / 999 091 822 / 946 202 445    •    edwindelacruz03@gmail.com'
    },
    quoteNumber: `COT-${this.pedidoId || 'SN'}`,
    createdAt: new Date(),

    // ----- Datos base que ya tenías -----
    pedido: {
      nombre: nombrePedido || '-',
      empleado: String(this.CodigoEmpleado || '—'),
      fechaRegistro: this.visualizarService?.selectAgregarPedido?.fechaCreate || '-'
    },
    cliente: {
      documento: this.infoCliente?.documento || '-',
      nombres: this.infoCliente?.nombre || '-',
      apellidos: this.infoCliente?.apellido || '-',
      empresa: (this as any)?.infoCliente?.empresa || undefined
    },
    evento: {
      numero: 1,
      fecha: fechaConDia,
      hora: ev?.Hora || '-',
      direccionExacta: ev?.DireccionExacta || ev?.Direccion || '-',
      notas: ev?.Notas || '-'
    },
    items: itemsMapped,
    observaciones: observaciones || 'No hay observaciones',

    // ----- Campos específicos para el layout de tu plantilla -----
    destinatario:
      (this as any)?.infoCliente?.empresa
      || `${this.infoCliente?.nombre || ''} ${this.infoCliente?.apellido || ''}`.trim()
      || '—',
    atencion: `${this.infoCliente?.nombre || ''} ${this.infoCliente?.apellido || ''}`.trim() || '—',
    eventoTitulo: `${nombrePedido || 'Evento'} – ${fechaConDia}`,

    // Sección 1) Fotografía
    seccionFoto: {
      equipos: [
        "2 cámaras fotográficas de 33 mega pixeles",
        "Lente profesional: 24–105 mm • 1 flash TTL"
      ],
      personal: ["2 fotógrafos"],
      locaciones: [
        "Tomas fotográficas según el evento",
        ev?.DireccionExacta || ev?.Direccion ? `Lugar: ${ev?.DireccionExacta || ev?.Direccion}` : null,
        "Horario referencial: 8:00 a.m. a 6:30 p.m."
      ].filter(Boolean),
      productoFinal: [
        "Carpeta online con fotos para su descarga – formato JPG de Alta Calidad"
      ]
    },

    // Sección 2) Video
    seccionVideo: {
      equipos: [
        "2 cámaras profesionales sistema 4K",
        "Trípode Manfrotto, luz LED, lentes de alta definición"
      ],
      personal: ["2 videógrafos, 1 asistente"],
      locaciones: ["Cobertura de las locaciones señaladas para el evento"],
      productoFinal: [
        "Carpeta online con video para su descarga – formato Full HD 1920 × 1080",
        "Video resumen de 2 min, aprox",
        "La edición NO incluye animación 2D y 3D"
      ]
    },

    // Totales en USD (si trabajas en PEN, aquí podrías convertir)
    totalesUSD: { foto: totalFoto, video: totalVideo },

    // Pie
    notaIGV: "Precios expresados en dólares no incluye el IGV (18%)",
    despedida: "Sin otro en particular nos despedimos agradeciendo de antemano por la confianza recibida.",
    fechaDoc: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }),
    firmaNombre: "Edwin De La Cruz",
    // firmaBase64: 'data:image/png;base64,...' // opcional
  };

  // 5) Llamada al backend y descarga del PDF
  this.quotes.generar(payload).subscribe({
    next: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${payload.quoteNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      this.loading = false;
    },
    error: () => {
      this.loading = false;
      swal.fire({
        text: 'No se pudo generar la cotización.',
        icon: 'error',
        showCancelButton: false,
        customClass: { confirmButton: 'btn btn-danger' },
        buttonsStyling: false
      });
    }
  });
}
private async loadLogo(): Promise<void> {
  const resp = await fetch('assets/logo-dlacruz.jpg');
  const blob = await resp.blob();
  const reader = new FileReader();
  await new Promise<void>((resolve, reject) => {
    reader.onload = () => { this.logoBase64 = reader.result as string; resolve(); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}



}
