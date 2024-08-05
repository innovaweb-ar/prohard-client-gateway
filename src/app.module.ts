import { Module } from '@nestjs/common';
import { InsumosModule } from './insumos/insumos.module';


@Module({
  imports: [InsumosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
