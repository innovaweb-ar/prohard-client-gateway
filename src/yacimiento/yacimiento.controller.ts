import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { YacimientoService } from './yacimiento.service';
import { INSUMO_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateYacimientoDto } from './dto/create-yacimiento.dto';
import { UpdateYacimientoDto } from './dto/update-yacimiento.dto';

@Controller('yacimiento')
export class YacimientoController {
  constructor(@Inject(INSUMO_SERVICE) private readonly insumoService: ClientProxy) { }

  @Post()
  createYacimiento(@Body() createYacimientoDto: CreateYacimientoDto) {
    return this.insumoService.send({ cmd: 'create_yacimiento' }, createYacimientoDto);
  }

  @Get()
  findAllYacimiento() {
    console.log("Buscando yacimientos");
    return this.insumoService.send({ cmd: 'find_all_yacimientos' }, {});
  }

  @Get('cliente/:id')
  findByCliente(@Param('id', ParseIntPipe) id: number) {
    console.log('Buscando yacimientos por clientes');
    return this.insumoService.send({ cmd: 'find_by_cliente' }, id);
  }

  @Get(':id')
  findOneYacimiento(@Param('id', ParseIntPipe) id: number) {
    return this.insumoService.send({ cmd: 'find_one_yacimiento' }, id);
  }


  @Patch()
  findUpdateYacimiento(@Param('id', ParseIntPipe) id: number, @Body() updateYacimientoDto: UpdateYacimientoDto) {
    return this.insumoService.send({ cmd: 'update_yacimiento' }, { id, ...updateYacimientoDto });
  }

  @Delete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.insumoService.send({ cmd: 'remove_yacimiento' }, id);
  }
}
