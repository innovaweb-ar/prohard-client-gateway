import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TransformSeccionesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Asegurarse de que req.body exista
    if (request.body && request.body.secciones) {
      let secciones = request.body.secciones;
      if (typeof secciones === 'string') {
        try {
          secciones = JSON.parse(secciones);
        } catch (error) {
          console.error('Error al parsear secciones:', error);
        }
      }
      // Si cada elemento tiene la propiedad "property", desempacarlo
      if (Array.isArray(secciones) && secciones.length && secciones[0].property) {
        secciones = secciones.map(elem => elem.property);
      }
      request.body.secciones = secciones;
    }
    return next.handle();
  }
}