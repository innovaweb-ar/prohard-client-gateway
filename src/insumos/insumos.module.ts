import { Logger, Module } from '@nestjs/common';
import { InsumosController } from './insumos.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {envs, INSUMO_SERVICE} from 'src/config';
import { env } from 'process';

@Module({
  controllers: [InsumosController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        name: INSUMO_SERVICE, 
        transport: Transport.TCP,
        options: {
          host: envs.insumosMicroserviceHost,
          port: envs.insumoMicroservicePort
        }
      }
    ])
  ]
})
export class InsumosModule {
  constructor(){
    const logger = new Logger();

    console.log(envs);
    logger.log(env);
  }
}
