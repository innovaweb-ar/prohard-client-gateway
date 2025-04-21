import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { INSUMO_SERVICE } from 'src/config';
import { CreateOrdenFabricacionDto } from './dto/create-orden-fabricacion.dto';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { UpdateOrdenFabricacionDto } from './dto/update-orden-fabricacion.dto';

@Controller('orden-fabricacion')
export class OrdenFabricacionController {


  constructor(
    @Inject(INSUMO_SERVICE) private readonly insumosClient: ClientProxy
  ) { }


  @Post()
  createOrdenFrabicacion(@Body() createORdenFabricacionDto: CreateOrdenFabricacionDto) {

    console.log("A crearse la orden")
    return this.insumosClient.send({ cmd: 'createOrdenFabricacion' }, createORdenFabricacionDto);
  }

  @Get()
  findAllOrdenFrabicacion() {
    console.log("devolviendo Ordenes");
    return this.insumosClient.send({ cmd: 'findAllOrdenFabricacion' }, {});
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    console.log("buscando la orden");

    return this.insumosClient.send({ cmd: 'findOneOrdenFabricacion' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )

    //Otra forma

    // try {

    //   const insumo = await firstValueFrom(
    //     this.insumosClient.send({cmd: 'find_one_insumo'}, {id})
    //   );
    //   return insumo;
    // } catch (error) {
    //   console.log(error);

    //   throw new RpcException(error);

    // }

  }

  @Patch(':id')
  updateOrdenFrabicacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrdenFabricacion: UpdateOrdenFabricacionDto) {


    console.log(updateOrdenFabricacion);
    return this.insumosClient.send({ cmd: 'updateOrdenFabricacion' }, { id, ...updateOrdenFabricacion })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  /*@Delete(':id')
  deleteOrdenFrabicacion(@Param('id', ParseIntPipe) id: number) {
    return this.insumosClient.send({ cmd: 'updateEstadoOrdenFabricacion' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }*/

}
