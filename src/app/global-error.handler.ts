import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Sanitiza y previene que el error rompa la interfaz o exponga datos sensibles
    const mensaje = error.message ? error.message : 'Error desconocido en la aplicación.';
    
    console.error('Error No Controlado Ocurrido:', error);
    
    // Aquí puedes invocar un servicio de notificaciones tipo Toast / SnackBar
    alert(`Aviso: ${mensaje}`);
  }
}