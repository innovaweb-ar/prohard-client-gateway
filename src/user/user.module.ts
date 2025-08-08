import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MicroservicesModule } from 'src/microservices.module';

@Module({
  controllers: [UserController],
  imports:[MicroservicesModule],
  providers: [],
})
export class UserModule {}
