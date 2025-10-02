import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private baseUrl = 'http://localhost:3000/api'; // ← apunta directo al backend
  //private baseUrl = '/api'; // gracias al proxy apunta al backend en :3000

  constructor(private http: HttpClient) {}

  generar(payload: any) {
    return this.http.post(`${this.baseUrl}/cotizaciones`, payload, {
      responseType: 'blob' // <- recibes PDF
    });
  }
}
