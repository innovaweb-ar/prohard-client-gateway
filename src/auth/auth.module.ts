import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MicroservicesModule } from 'src/microservices.module';
import { envs } from 'src/config';
import { env } from 'process';

@Module({
  controllers: [AuthController],
  providers: [],
  imports:[
    MicroservicesModule
  ]
})
export class AuthModule {
  constructor(){
        const logger = new Logger();
    
        console.log(envs);
        logger.log(env);
  }
}
