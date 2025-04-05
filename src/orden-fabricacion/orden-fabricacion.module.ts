import { Module } from '@nestjs/common';
import { OrdenFabricacionController } from './orden-fabricacion.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [OrdenFabricacionController],
  imports:[MicroservicesModule]
})
export class OrdenFabricacionModule {}
