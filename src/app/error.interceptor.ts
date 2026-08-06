import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensajeUsuario = 'Ocurrió un error inesperado al procesar la solicitud.';

        if (error.error && error.error.mensaje) {
          // Captura el mensaje limpio formateado por Spring Boot GlobalExceptionHandler
          mensajeUsuario = error.error.mensaje;
        } else if (error.status === 0) {
          mensajeUsuario = 'No se pudo conectar con el servidor backend. Verifique su conexión.';
        }

        // Log técnico restringido a la consola de desarrollo (nunca mostrado directo al usuario final)
        console.error('Error HTTP Interno:', error);

        return throwError(() => new Error(mensajeUsuario));
      })
    );
  }
}