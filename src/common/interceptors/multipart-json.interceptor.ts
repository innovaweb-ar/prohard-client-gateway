import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MultipartJsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    console.log('Interceptando');

    // Caso 1: Si es JSON directo (sin archivos)
    if (typeof req.body === 'object' && !req.body.user) {
      return next.handle();
    }


    // Caso 2: FormData con campo 'checklist'
    if (req.body?.user) {
      try {
        req.body = JSON.parse(req.body.user);
        
        // Limpieza: Remover archivos del body si existen
        if (req.body.archivos) {
          delete req.body.archivos;
        }
      } catch (e) {
        throw new BadRequestException('Formato JSON inválido en user');
      }
    }

    return next.handle();
  }
}