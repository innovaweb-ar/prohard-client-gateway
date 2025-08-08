import { Module } from '@nestjs/common';
import { MicroservicesModule } from 'src/microservices.module';
import { MenuController } from './menu.controller';

@Module({
  controllers: [MenuController],
  providers: [],
  imports:[MicroservicesModule]
})
export class MenuModule {}
