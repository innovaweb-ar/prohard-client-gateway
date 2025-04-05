import { Module } from '@nestjs/common';
import { MovimientoController } from './movimiento.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [MovimientoController],
  imports:[
    MicroservicesModule
  ]
})
export class MovimientoModule {}
