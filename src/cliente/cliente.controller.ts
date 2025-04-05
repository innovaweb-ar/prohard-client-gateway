import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { INSUMO_SERVICE } from 'src/config';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { catchError } from 'rxjs';

@Controller('cliente')
export class ClienteController {
    constructor(@Inject(INSUMO_SERVICE) private readonly clienteClient: ClientProxy) { }


    @Post()
    createCliente(@Body() createClienteDto: CreateClienteDto) {
        return this.clienteClient.send({ cmd: 'create_cliente' }, createClienteDto);
    }

    @Get()
    findAllClientes() {
        console.log("devolviendo clientes");
        return this.clienteClient.send({ cmd: 'find_all_clientes' }, {});
    }

    @Get(':id')
    async findOneCliente(@Param('id', ParseIntPipe) id: number) {
        return this.clienteClient.send({ cmd: 'find_one_cliente' }, { id });
    }

    @Patch(':id')
    updateCliente(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClienteDto: UpdateClienteDto) {

        return this.clienteClient.send({ cmd: 'update_cliente' }, { id, ...updateClienteDto })
            .pipe(
                catchError(err => { throw new RpcException(err) })
            )
    }


    @Delete(':id')
    removeCliente(@Param('id', ParseIntPipe) id: number) {
        return this.clienteClient.send({ cmd: 'remove_cliente' }, { id });
    }

}
