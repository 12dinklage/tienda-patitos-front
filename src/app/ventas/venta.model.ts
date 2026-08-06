export interface Venta {
  id?: number;
  patoId: number;
  cantidad: number;
  precioTotal?: number;
  fechaVenta?: string;
  estado?: string;
}