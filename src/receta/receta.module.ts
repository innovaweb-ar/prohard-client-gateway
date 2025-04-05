import { Module } from '@nestjs/common';
import { RecetaController } from './receta.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [RecetaController],
  imports:[
    MicroservicesModule
  ],
  providers: [],
})
export class RecetaModule {}
