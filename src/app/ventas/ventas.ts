import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { VentaService } from './venta.service';
import { Venta } from './venta.model';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.html',
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./ventas.css']
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  nuevaVenta: Venta = { patoId: 0, cantidad: 1 };
  
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.cargarVentas();
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

    if (this.nuevaVenta.patoId <= 0 || this.nuevaVenta.cantidad <= 0) {
      this.mensajeError = 'Por favor, ingresa un ID de pato y cantidad válidos.';
      return;
    }

    this.ventaService.registrarVenta(this.nuevaVenta).subscribe({
      next: (res) => {
        this.mensajeExito = '¡Venta registrada con éxito!';
        this.nuevaVenta = { patoId: 0, cantidad: 1 };
        this.cargarVentas();
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Ocurrió un error al procesar la venta.';
      }
    });
  }
}