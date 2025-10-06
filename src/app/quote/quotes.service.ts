// src/app/quote/quotes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private baseUrl = environment.apiUrl; // ✅ usa apiUrl

  constructor(private http: HttpClient) {}

  generar(payload: any) {
    // Asegúrate que el backend tenga esta ruta /api/cotizaciones
    return this.http.post(`${this.baseUrl}/cotizaciones`, payload, { responseType: 'blob' });
  }
}
