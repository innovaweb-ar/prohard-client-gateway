import { Logger, Module } from '@nestjs/common';
import { InsumosController } from './insumos.controller';
import {envs} from 'src/config';
import { env } from 'process';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [InsumosController],
  providers: [],
  imports:[
   MicroservicesModule
  ]
})
export class InsumosModule {
  constructor(){
    const logger = new Logger();

    console.log(envs);
    logger.log(env);
  }
}
