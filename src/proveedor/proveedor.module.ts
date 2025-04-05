import { Module } from '@nestjs/common';
import { ProveedorController } from './proveedor.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [ProveedorController],
  imports:[MicroservicesModule]
})
export class ProveedorModule {}
