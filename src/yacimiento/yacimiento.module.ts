import { Module } from '@nestjs/common';
import { YacimientoController } from './yacimiento.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [YacimientoController],
  providers: [],
  imports:[MicroservicesModule]
})
export class YacimientoModule {}
