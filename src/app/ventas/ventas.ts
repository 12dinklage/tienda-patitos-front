import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { VentaService } from './venta.service';
import { PatoService } from '../pato.service';
import { VentaRequest, VentaResponse } from './venta.model';

@Component({
  standalone: true,
  selector: 'app-ventas',
  templateUrl: './ventas.html',
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./ventas.css']
})
export class VentasComponent implements OnInit {

    nuevaVenta: VentaRequest = {
    patoId: 0,
    cantidad: 1
  };

  patos: any[] = [];
  ventas: VentaResponse[] = [];
  
  mensajeExito: string = '';
  mensajeError: string = '';
  ultimaVentaProcesada?: VentaResponse;

  constructor(
    private ventaService: VentaService,
    private patoService: PatoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPatos();
    this.cargarVentas();
  }
  cargarPatos(): void {
    this.patoService.getPatos().subscribe({
      next: (data) => {
        console.log('VentasComponent: patos recibidos', data);
        this.patos = data || [];
        // ensure view updates when using zone change coalescing
        try { this.cdr.detectChanges(); } catch (e) {}
      },
      error: (err) => {
        console.error('Error cargando patos en VentasComponent:', err);
        this.patos = [];
        this.cdr.detectChanges();
        this.mensajeError = 'No se pudo cargar la lista de patos.';
      }
    });
  }
  cargarVentas(): void {
    this.ventaService.obtenerVentas().subscribe({
      next: (data) => (this.ventas = data),
      error: () => (this.mensajeError = 'No se pudieron cargar las ventas.')
    });
  }

  realizarVenta(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.ultimaVentaProcesada = undefined;

    if (this.nuevaVenta.patoId <= 0 || this.nuevaVenta.cantidad <= 0) {
      this.mensajeError = 'Por favor, selecciona un pato y una cantidad válidos.';
      return;
    }

    this.ventaService.registrarVenta(this.nuevaVenta).subscribe({
      next: (res) => {
        this.ultimaVentaProcesada = res;
        const total = res.precioTotal ?? this.calcularPrecioEstimado();
        this.mensajeExito = `¡Venta registrada con éxito! Total a pagar: $${total}`;
        this.nuevaVenta = { patoId: 0, cantidad: 1 };
        
        this.cargarPatos();
        this.cargarVentas();
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al procesar la venta.';
      }
    });
  }

  calcularPrecioEstimado(): number {
    const pato = this.patos.find((p) => p.id === this.nuevaVenta.patoId);
    if (!pato) return 0;
    const precioBase = pato.precioBase ?? pato.precio ?? 0;
    const cantidad = this.nuevaVenta.cantidad ?? 1;
    const subtotal = precioBase * cantidad;

    // Descuento por volumen
    let descVolumen = 0;
    if (cantidad > 250) {
      descVolumen = 0.12;
    } else if (cantidad > 100) {
      descVolumen = 0.10;
    }

    // Ajuste por tiempo de entrega
    let horasEntrega = Infinity;
    if (this.nuevaVenta.fechaEntregaProgramada) {
      const fecha = new Date(this.nuevaVenta.fechaEntregaProgramada);
      const diffMs = fecha.getTime() - Date.now();
      horasEntrega = Math.floor(diffMs / (1000 * 60 * 60));
    }
    let factorTiempo = 0;
    if (horasEntrega <= 24) {
      factorTiempo = -0.05;
    } else if (horasEntrega <= 168) {
      factorTiempo = -0.02;
    } else {
      factorTiempo = 0.08;
    }

    const total = subtotal * (1 - descVolumen) * (1 + factorTiempo);
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }
}