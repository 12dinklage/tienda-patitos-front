import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pato } from './pato.model';

@Injectable({
  providedIn: 'root'
})
export class PatoService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getPatos(): Observable<Pato[]> {
    return this.http.get<Pato[]>(`${this.apiUrl}/patos`);
  }

  guardarPato(pato: Pato): Observable<Pato> {
    return this.http.post<Pato>(`${this.apiUrl}/patos`, pato);
  }

  actualizarPato(id: number, pato: Pato): Observable<Pato> {
    return this.http.put<Pato>(`${this.apiUrl}/patos/${id}`, pato);
  }

  eliminarPato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/patos/${id}`);
  }

  procesarVenta(solicitud: { patoId: number; cantidad: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ventas`, solicitud);
  }
}