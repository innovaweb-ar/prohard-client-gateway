import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { INSUMO_SERVICE } from 'src/config';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';

@Controller('movimiento')
export class MovimientoController {



    constructor(
        @Inject(INSUMO_SERVICE) private readonly insumosClient: ClientProxy
    ) { }


    @Post()
    createMovimiento(@Body() createMovimientoDto: CreateMovimientoDto) {

        return this.insumosClient.send({cmd: 'createMovimiento'}, createMovimientoDto);
    }

    @Get()
    findAllMovimientos(@Query() paginationDto: PaginationDto) {
        return this.insumosClient.send({cmd: 'findAllMovimiento'}, paginationDto);
    }

    @Get('stock')
    getGeneralStock(@Query() paginationDto: PaginationDto){
        return this.insumosClient.send({cmd: 'getGeneralStock'}, paginationDto)
    }

    @Get('stock/:insumoId')
    getStockDetailByInsumo(@Param('insumoId', ParseIntPipe) insumoId: number){
        return this.insumosClient.send({cmd: 'getStockDetailByInsumo'}, {insumoId});
    }

    /*@Delete(':id')
    deleteOrdenFrabicacion(@Param('id', ParseIntPipe) id: number) {
      return this.insumosClient.send({ cmd: 'updateEstadoOrdenFabricacion' }, { id })
        .pipe(
          catchError(err => { throw new RpcException(err) })
        )
    }*/
}
