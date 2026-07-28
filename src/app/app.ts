import { Component } from '@angular/core';
import { Pato } from './pato.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  pestanaActiva: 'patos' | 'ventas' = 'patos';

  // Datos mock iniciales idénticos a la imagen de referencia
  patos: Pato[] = [
    { id: 1, color: 'Amarillo', tamano: 'Pequeño', stock: 50 },
    { id: 2, color: 'Verde', tamano: 'Grande', stock: 20 },
    { id: 3, color: 'Roja', tamano: 'Pequeño', stock: 20 },
    { id: 4, color: 'Amarillo', tamano: 'Grande', stock: 50 }
  ];

  abrirModalAgregar() {
    alert('Próximamente: Formulario para agregar un nuevo pato.');
  }

  editarPato(pato: Pato) {
    alert(`Editar pato ID: ${pato.id}`);
  }

  eliminarPato(id?: number) {
    this.patos = this.patos.filter(p => p.id !== id);
  }
}
