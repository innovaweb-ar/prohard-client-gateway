import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {envs} from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';
import * as cors from 'cors';

async function bootstrap() {

  const logger = new Logger('Main-Gateway');


  const app = await NestFactory.create(AppModule);

  app.enableCors();
  //todas nuestras endpoint comienzan con api en la url

  app.setGlobalPrefix('api');

  app.useGlobalPipes( 
    new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
    }) 
   );

  app.useGlobalFilters(new RpcCustomExceptionFilter());


  await app.listen(envs.port);

  logger.log(`Gateway running on port ${envs.port}`);

}

bootstrap();
