import { Module } from '@nestjs/common';
import { ContactoController } from './contacto.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [ContactoController],
  providers: [],
  imports: [
    MicroservicesModule
  ],
})
export class ContactoModule {}
