import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, envs, INSUMO_SERVICE } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        // Servicio compartido para Insumos y Depositos
        name: INSUMO_SERVICE, // También lo puedes usar para Depositos
        transport: Transport.TCP,
        options: {
          host: envs.insumosMicroserviceHost, // Mismo host actual
          port: envs.insumoMicroservicePort, // Mismo puerto actual
        },
      },
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.authMicroserviceHost, // Host del microservicio de autenticación
          port: envs.authMicroservicePort, // Puerto del microservicio de autenticación
        },
      }
    ]),
  ],
  exports: [ClientsModule], // Exporta ClientsModule para que otros módulos lo usen
})
export class MicroservicesModule {}