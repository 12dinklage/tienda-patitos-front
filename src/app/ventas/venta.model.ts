export interface VentaRequest {
  patoId: number;
  cantidad: number;
  fechaEntregaProgramada?: string;
}
export interface VentaResponse {
  id?: number;
  patoId: number;
  cantidad: number;
  precioTotal?: number;
  fechaVenta?: string;
  estado?: string;
}