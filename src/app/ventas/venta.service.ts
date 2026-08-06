import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaRequest, VentaResponse } from './venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) {}

  registrarVenta(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(this.apiUrl, venta);
  }

  obtenerVentas(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.apiUrl);
  }
}