import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { INSUMO_SERVICE } from 'src/config';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { UpdateDepositoDto } from './dto/update-deposito.dto';

@Controller('depositos')
export class DepositosController {

    constructor(
        @Inject(INSUMO_SERVICE) private readonly insumosClient: ClientProxy
    ) { }


    @Post()
    createDeposito(@Body() createDepositoDto: CreateDepositoDto) {
        return this.insumosClient.send({ cmd: 'createDeposito' }, createDepositoDto)
    }

    @Get()
    findAllDepositos(@Query() paginationDto: PaginationDto) {
        return this.insumosClient.send({cmd: 'findAllDepositos'}, paginationDto);
    }

    @Get(':id')
    async findOneDeposito(@Param('id') id: string) {


        return this.insumosClient.send({cmd: 'findOneDeposito'}, { id })
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
    updateDeposito(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateDepositoDto: UpdateDepositoDto) {

        return this.insumosClient.send({cmd: 'updateDeposito'}, { id, ...UpdateDepositoDto })
            .pipe(
                catchError(err => { throw new RpcException(err) })
            )
    }

    @Delete(':id')
    deleteDeposito(@Param('id', ParseIntPipe) id: number) {
        return this.insumosClient.send({cmd: 'removeDeposito'}, { id })
            .pipe(
                catchError(err => { throw new RpcException(err) })
            )
    }

    
}
