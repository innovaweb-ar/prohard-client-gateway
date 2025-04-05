import { Logger, Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { MicroservicesModule } from 'src/microservices.module';
import { env } from 'process';


@Module({
  controllers: [ClienteController],
  imports:[
    MicroservicesModule
  ]
})
export class ClienteModule {
  constructor(){
    const logger = new Logger();

    logger.log(env);

  }
    
}
