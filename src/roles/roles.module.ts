import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [RolesController],
  imports:[MicroservicesModule],
  providers: [],
})
export class RolesModule {}
