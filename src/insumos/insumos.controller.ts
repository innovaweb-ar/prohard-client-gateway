import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { INSUMO_SERVICE } from 'src/config';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { catchError } from 'rxjs';
import { UpdateInsumoDto } from './dto/update-insumo.dto';

@Controller('insumos')
export class InsumosController {
  constructor(
    @Inject(INSUMO_SERVICE) private readonly insumosClient: ClientProxy
  ) {}


  @Post()
  createInsumo(@Body() crateInsumoDto: CreateInsumoDto){

    return this.insumosClient.send({cmd: 'create_insumo'}, crateInsumoDto);
  }

  @Get()
  findAllInsumos(@Query() paginationDto: PaginationDto){
    return this.insumosClient.send({cmd: 'find_all_insumos'}, paginationDto);
  }

  @Get(':id')
  async findOneInsumo(@Param('id') id:string){


    return this.insumosClient.send({cmd: 'find_one_insumo'}, {id})
    .pipe(
      catchError(err => {throw new RpcException(err)})
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
  updateInsumo(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateInsumoDto: UpdateInsumoDto){

    return this.insumosClient.send({cmd: 'update_insumo'},{id,...updateInsumoDto})
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  @Delete(':id')
  deleteInsumo(@Param('id', ParseIntPipe) id:number){
    return this.insumosClient.send({cmd: 'delete_insumo'},{id})
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

}
