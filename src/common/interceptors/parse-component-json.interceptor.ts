import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseComponentesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Solo cuando sea multipart/form-data
    if (!req.is('multipart/form-data')) {
      return next.handle();
    }

    // Si hay un campo "componentes" y viene como string, parsearlo
    const comp = req.body.componentes;
    if (typeof comp === 'string') {
      try {
        req.body.componentes = JSON.parse(comp);
      } catch {
        throw new BadRequestException('Formato JSON inválido en "componentes"');
      }
    }

    return next.handle();
  }
}