import { Logger, Module } from '@nestjs/common';
import { DepositosController } from './depositos.controller';
import { env } from 'process';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [DepositosController],
  providers: [],
  imports:[MicroservicesModule]
})
export class DepositosModule { 
  constructor(){
    const logger = new Logger();
    logger.log(env)
  }
}

