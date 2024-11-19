import { Module } from '@nestjs/common';
import { InsumosModule } from './insumos/insumos.module';
import { PresupuestoModule } from './presupuesto/presupuesto.module';


@Module({
  imports: [InsumosModule, PresupuestoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
