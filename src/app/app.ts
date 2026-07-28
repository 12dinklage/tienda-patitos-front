import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatoService } from './pato.service';
import { Pato } from './pato.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      next: (data) => this.patos = data,
      error: (err) => console.error('Error al cargar patos:', err)
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
    this.patoService.actualizarPato(this.patoForm.id, this.patoForm).subscribe({
      next: () => {
        this.mostrarMensaje('Pato actualizado con éxito', false);
        this.cerrarModal();
        this.cargarPatos();
      },
      error: (err) => {
        console.error('Error al editar:', err);
        this.mostrarMensaje('Error al actualizar el pato', true);
      }
    });
  }
  else {
    // Si NO tiene ID, CREAMOS UNO NUEVO
    this.patoService.guardarPato(this.patoForm).subscribe({
      next: () => {
        this.mostrarMensaje('Pato registrado con éxito', false);
        this.cerrarModal();
        this.cargarPatos();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.mostrarMensaje('Error al registrar el pato', true);
      }
    });
  }
}

eliminarPato(id: number | undefined): void {
  if (!id) return;

  if (confirm('¿Estás seguro de eliminar este pato?')) {
    this.patoService.eliminarPato(id).subscribe({
      next: () => {
        this.mostrarMensaje('Pato eliminado', false);
        // Recargar la tabla tras la respuesta exitosa del servidor
        this.cargarPatos(); 
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.mostrarMensaje('No se pudo eliminar el pato', true);
      }
    });
  }
}
  realizarVenta(): void {
    if (!this.ventaForm.patoId || this.ventaForm.patoId === 0) {
      this.mostrarMensaje('Selecciona un pato', true);
      return;
    }

    this.patoService.procesarVenta(this.ventaForm).subscribe({
      next: (res) => {
        this.mostrarMensaje(`¡Venta realizada! Total: $${res.precioTotal || res.montoTotal}`, false);
        this.ventaForm = { patoId: 0, cantidad: 1 };
        this.cargarPatos();
      },
      error: (err) => this.mostrarMensaje(err.error || 'Error al procesar la venta', true)
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
    setTimeout(() => this.mensaje = '', 5000);
  }
}
