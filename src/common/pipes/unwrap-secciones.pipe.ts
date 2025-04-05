import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class UnwrapSeccionesPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);

    if (value && value.secciones) {
      let secciones = value.secciones;
      // Si secciones viene como string, parsearlo
      if (typeof secciones === 'string') {
        try {
          secciones = JSON.parse(secciones);
        } catch (error) {
          // Manejar error si es necesario o re-lanzarlo
        }
      }
      // Desempaquetar si cada elemento tiene la propiedad "property"
      if (Array.isArray(secciones) && secciones.length > 0 && secciones[0].property) {
        secciones = secciones.map(elem => elem.property);
      }
      // Reasignar el valor transformado
      value.secciones = secciones;
    }
    return value;
  }
}