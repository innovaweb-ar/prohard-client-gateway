import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [PermissionController],
  imports:[MicroservicesModule],
  providers: [],
})
export class PermissionModule {}
