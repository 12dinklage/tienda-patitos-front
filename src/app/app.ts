import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatoService } from './pato.service';
import { Pato } from './pato.model';
import { VentasComponent } from './ventas/ventas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, VentasComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  pestanaActiva: 'patos' | 'ventas' = 'patos';
  mostrarModal: boolean = false;

  patos: Pato[] = [];

  // Formulario Pato
  patoForm: Pato = {
    color: '',
    tamano: 'PEQUENO',
    precioBase: 0,
    stock: 0
  };

  // Formulario Venta
  ventaForm = {
    patoId: 0,
    cantidad: 1
  };

  mensaje: string = '';
  esError: boolean = false;

  constructor(private patoService: PatoService) {}

  ngOnInit(): void {
    this.cargarPatos();
  }

  cargarPatos(): void {
    this.patoService.getPatos().subscribe({
      next: (data) => (this.patos = data),
      error: (err) => {
        console.error('Error al cargar patos:', err);
        this.mostrarMensaje('No se pudo cargar el inventario de patos.', true);
      }
    });
  }

  abrirModalAgregar(): void {
    this.limpiarPatoForm();
    this.mostrarModal = true;
  }

  editarPato(pato: Pato): void {
    this.patoForm = { ...pato };
    this.mostrarModal = true;
  }

  guardarPato(event?: Event): void {
    if (event) event.preventDefault();

    if (this.patoForm.id) {
      // Edición
      this.patoService.actualizarPato(this.patoForm.id, this.patoForm).subscribe({
        next: () => {
          this.mostrarMensaje('Pato actualizado con éxito', false);
          this.cerrarModal();
          this.cargarPatos();
        },
        error: (err) => {
          console.error('Error al editar:', err);
          const msg = this.extraerMensajeError(err, 'Error al actualizar el pato.');
          this.mostrarMensaje(msg, true);
        }
      });
    } else {
      // Creación
      this.patoService.guardarPato(this.patoForm).subscribe({
        next: () => {
          this.mostrarMensaje('Pato registrado con éxito', false);
          this.cerrarModal();
          this.cargarPatos();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          const msg = this.extraerMensajeError(err, 'Error al registrar el pato.');
          this.mostrarMensaje(msg, true);
        }
      });
    }
  }

  eliminarPato(id: number | undefined): void {
    if (!id) return;

    if (confirm('¿Estás seguro de eliminar este pato?')) {
      this.patoService.eliminarPato(id).subscribe({
        next: () => {
          this.mostrarMensaje('Pato eliminado correctamente', false);
          this.cargarPatos();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          const msg = this.extraerMensajeError(err, 'No se pudo eliminar el pato.');
          this.mostrarMensaje(msg, true);
        }
      });
    }
  }

  realizarVenta(): void {
    if (!this.ventaForm.patoId || this.ventaForm.patoId === 0) {
      this.mostrarMensaje('Por favor, selecciona un pato de la lista.', true);
      return;
    }

    if (!this.ventaForm.cantidad || this.ventaForm.cantidad <= 0) {
      this.mostrarMensaje('Ingresa una cantidad válida mayor a 0.', true);
      return;
    }

    this.patoService.procesarVenta(this.ventaForm).subscribe({
      next: (res) => {
        const total = res.precioTotal ?? res.montoTotal ?? 0;
        this.mostrarMensaje(`¡Venta realizada con éxito! Total: $${total}`, false);
        this.ventaForm = { patoId: 0, cantidad: 1 };
        this.cargarPatos();
      },
      error: (err) => {
        console.error('Error al procesar la venta:', err);
        const msg = this.extraerMensajeError(err, 'Error al procesar la venta.');
        this.mostrarMensaje(msg, true);
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.limpiarPatoForm();
  }

  limpiarPatoForm(): void {
    this.patoForm = {
      id: undefined,
      color: '',
      tamano: 'PEQUENO',
      precioBase: 0,
      stock: 0
    };
  }

  mostrarMensaje(msg: string, error: boolean): void {
    this.mensaje = msg;
    this.esError = error;
    setTimeout(() => (this.mensaje = ''), 5000);
  }

  private extraerMensajeError(err: any, mensajePorDefecto: string): string {
    if (typeof err.error === 'string') {
      return err.error;
    }
    if (err.error?.mensaje) {
      return err.error.mensaje;
    }
    if (err.error?.message) {
      return err.error.message;
    }
    return mensajePorDefecto;
  }
}
