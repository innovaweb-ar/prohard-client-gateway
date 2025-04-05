import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { INSUMO_SERVICE } from 'src/config';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { catchError } from 'rxjs';

@Controller('proveedor')
export class ProveedorController {
  
  constructor(@Inject(INSUMO_SERVICE) private readonly proveedorClient: ClientProxy) {}

  @Post()
  createProveedor(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorClient.send({ cmd: 'create_proveedor' }, createProveedorDto);
  }

  @Get()
  findAllProveedores() {
    return this.proveedorClient.send({ cmd: 'find_all_proveedores' }, {});
  }

  @Get(':id')
  async findOneProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorClient.send({ cmd: 'find_one_proveedor' }, { id });
  }

  @Patch(':id')
  updateProveedor(@Param('id', ParseIntPipe) id: number, @Body() updateProveedorDto: any) {
    return this.proveedorClient
      .send({ cmd: 'update_proveedor' }, { id, ...updateProveedorDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  removeProveedor(@Param('id', ParseIntPipe) id: number) {
    return this.proveedorClient.send({ cmd: 'remove_proveedor' }, { id });
  }
}