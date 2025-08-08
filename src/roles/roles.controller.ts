import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'src/config';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: ClientProxy) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto){

    console.log("Creando Role");
    return this.authService.send('createRole', createRoleDto);
  }

  @Get()
  findAllRole(){
    return this.authService.send('findAllRoles',{});
  } 
}
