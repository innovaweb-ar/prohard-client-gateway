import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PRESUPUESTO_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto, StatusDto } from './dto';

@Controller('presupuesto')
export class PresupuestoController {
  constructor(
    @Inject(PRESUPUESTO_SERVICE) private readonly presupuestoClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createPresupuestoDto: CreateOrderDto) {
    return this.presupuestoClient.send('createOrder', createPresupuestoDto)
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.presupuestoClient.send('findAllOrders',orderPaginationDto);
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto:StatusDto,
    @Query() paginationDto:PaginationDto){
      try {
        return this.presupuestoClient.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status
        });
      } catch (error) {
        throw new RpcException(error);
      }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {

    //#########  Otra Forma  ###############
    /*return this.presupuestoClient.send('findOneOrder', {id})
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )*/

    try {
      const order = await firstValueFrom(
        this.presupuestoClient.send('findOneOrder', {id})
      )

      return order;

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() statusDto: StatusDto
  ){try {
    return this.presupuestoClient.send('changeOderStatus', {id, status: statusDto.status});
    //return {id, status: statusDto.status}
  } catch (error) {
    throw new RpcException(error);
  }
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updatePresupuestoDto: UpdatePresupuestoDto) {
    return this.presupuestoService.update(+id, updatePresupuestoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presupuestoService.remove(+id);
  }*/


}
