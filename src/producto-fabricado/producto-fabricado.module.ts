import { Module } from '@nestjs/common';
import { ProductoFabricadoController } from './producto-fabricado.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [ProductoFabricadoController],
  imports:[
    MicroservicesModule
  ],
  providers: [],
})
export class ProductoFabricadoModule {}
