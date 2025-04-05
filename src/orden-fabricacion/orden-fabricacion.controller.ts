import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { INSUMO_SERVICE } from 'src/config';
import { CreateOrdenFabricacionDto } from './dto/create-orden-fabricacion.dto';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Controller('orden-fabricacion')
export class OrdenFabricacionController {


    constructor(
        @Inject(INSUMO_SERVICE) private readonly insumosClient: ClientProxy
      ) { }
    
    
      @Post()
      createOrdenFrabicacion(@Body() createORdenFabricacionDto: CreateOrdenFabricacionDto) {
    
        return this.insumosClient.send({ cmd: 'createOrdenFabricacion' }, createORdenFabricacionDto);
      }
    
      @Get()
      findAllOrdenFrabicacion(@Query() paginationDto: PaginationDto) {
        console.log("devolviendo insumos");
        return this.insumosClient.send({ cmd: 'findAllOrdenesFabricacion' }, paginationDto);
      }
    
      @Get(':estado')
      async findOrdenFabricacionByEstado(@Param('estado') estado: string) {
    
    
        return this.insumosClient.send({ cmd: 'findOrdenFabricacionByEstado' }, { estado })
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
        @Body() updateEstadoDto: UpdateEstadoDto) {
    
        return this.insumosClient.send({ cmd: 'updateEstadoOrdenFabricacion' }, { id, ...updateEstadoDto })
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
