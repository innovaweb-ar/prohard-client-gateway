import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, INSUMO_SERVICE } from 'src/config';

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
    ]),
  ],
  exports: [ClientsModule], // Exporta ClientsModule para que otros módulos lo usen
})
export class MicroservicesModule {}