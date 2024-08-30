import { Logger, Module } from '@nestjs/common';
import { PresupuestoController } from './presupuesto.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRESUPUESTO_SERVICE } from 'src/config';

@Module({
  controllers: [PresupuestoController],
  imports:[
    ClientsModule.register([
      {
        name: PRESUPUESTO_SERVICE,
        transport: Transport.TCP,
        options:{
          host: envs.presupustoMicroserviceHost,
          port: envs.presupuestoMicroservicePort
        }
      }
    ])
  ],
  providers: [],
})
export class PresupuestoModule {
  constructor(){
    const logger = new Logger();
    console.log(envs);
    logger.log(envs);
  }
}
