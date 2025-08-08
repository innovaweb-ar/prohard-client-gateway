import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) { }


  @Post()
  createPermission(@Body() createPermissionDto: CreatePermissionDto){
    return this.authClient.send('createPermission', createPermissionDto);
  }

  @Get()
  getPermissions(){
    return this.authClient.send('findAllPermission',{});
  }

  @Get(':roleId')
  getPermisoByRole(@Param('roleId',ParseIntPipe) roleId: number){
    return this.authClient.send('getPermissionByRole', roleId);
  }

}