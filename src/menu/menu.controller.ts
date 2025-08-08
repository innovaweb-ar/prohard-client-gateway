import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'src/auth/decorators';
import { CurrenteUser } from 'src/auth/interfaces/current-user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('menu')
export class MenuController {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: ClientProxy) { }


  @Get()
  findAllYacimiento(@User() user:CurrenteUser) {
    return this.authService.send({ cmd: 'find_menu' }, user.scopes);
  }

}
