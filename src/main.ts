import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { UnwrapSeccionesPipe } from './common/pipes/unwrap-secciones.pipe';


async function bootstrap() {

  const logger = new Logger('Main-Gateway');


  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Configurar la carpeta estática para servir archivos


  // Configurar CORS (permite cualquier origen, métodos y headers)
  app.enableCors({
    origin: true, // o especifica tu frontend: ['http://localhost:4200']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // si necesitas enviar cookies/tokens
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());


  await app.listen(envs.port);

  logger.log(`Gateway running on port ${envs.port}`);

}

bootstrap();
